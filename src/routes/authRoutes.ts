import express from 'express';
import axios from 'axios';
import parseXmlToJson from '../helpers/parseXmlToJson';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import serverMessageSwitcher from '../helpers/serverMessageSwitcher';
dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Render the login page.
 *     description: >
 *       Renders an EJS template with the login form.
 *       Also supports showing error messages from redirects with query strings like ?message=logout-success.
 *     parameters:
 *       - in: query
 *         name: message
 *         type: string
 *         description: Error message to display on the login page.
 *       - in: query
 *         name: type
 *         type: string
 *         description: (optional) Type of the message (error, success, default)
 *     responses:
 *       200:
 *         description: Renders the login page.
 */
router.get('/login', (req, res) => {
  const {serverMessage, serverMessageType} = serverMessageSwitcher(req.query.message as string | undefined, req.query.type as string | undefined)
  res.render('login', {serverMessage: serverMessage, type: serverMessageType});
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user.
 *     description: Logout the currently authenticated user.
 *     responses:
 *       302:
 *         description: Logout successful - Destroys the session and redirects to login page.
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.clearCookie('accessToken');
    res.clearCookie('userId');
    res.redirect('/auth/login?message=logout-success');
  });
});


/*******************************
 *       AUTHENTICATION         *
 *******************************/
// Generate base64 encoded credentials to be used in the request header
// End result will be: 'Authorization': `Basic {encodedStringHere}`,
const crowdCredentials = Buffer.from(`${process.env.CROWD_USER}:${process.env.CROWD_PASSWORD}`).toString('base64');

export interface CustomSession {
  user?: {
    id: string;
    uid: string;
    name: string;
    email: string;
  };
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user.
 *     description: Authenticate a user based on the provided credentials.
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: formData
 *         name: username
 *         description: User's username.
 *         type: string
 *         required: true
 *       - in: formData
 *         name: password
 *         description: User's password.
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       401:
 *         description: Unauthorized - Invalid credentials.
 *       500:
 *         description: Server Error.
 */
router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const _session = req.session as CustomSession;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.CROWD_AUTH_URL}${username}`,
    headers: {
      'Authorization': `Basic ${crowdCredentials}`,
      'Content-Type': 'application/json',
    },
    data : JSON.stringify({"value": `${password}`})
  };

  axios.request(config)
    .then(async (response) => {

      // Create a session user
      const userJson = await parseXmlToJson(response.data);
      _session.user = {
        id: '', // @todo: to be implemented later
        uid: userJson.name,
        name: userJson['display-name'],
        email: userJson.email,
      };

      // Create a JWT token
      const accessToken = jwt.sign(
        {userId: _session.user.uid},
        process.env.JWT_SECRET || 'eZgAl+XqTNW0skN85crbMQ==',
        {expiresIn: process.env.TOKEN_EXPIRATION || '1d'}
      );

      // Set the JWT as a cookie
      res.cookie('accessToken', accessToken, {httpOnly: true});
      res.cookie('userId', _session.user.uid)
      res.redirect('/app');
    })
    .catch((error) => {
      if ((error as any).code === 'ECONNREFUSED') {
        return res.status(503).json({error: 'Service Unavailable - Connection Refused'});
      } else {
        return res.status(500).json({error: 'Server Error'});
      }
    });
});

/**
 * @swagger
 * /auth/user-info:
 *   get:
 *     summary: Get user information.
 *     description: Retrieve details of the currently authenticated user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *       401:
 *         description: Unauthorized - No session exists or user is not authenticated.
 */
router.get('/user-info', (req, res) => {
  const _session = req.session as CustomSession;
  if (req.session && _session.user) {
    const { uid, name, email } = _session.user;
    res.status(200).json({ uid, name, email });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

/**
 * @swagger
 * /auth/user-list:
 *   get:
 *     summary: Get user list from external service.
 *     description: Retrieve the list of users from an external service.
 *     responses:
 *       200:
 *         description: User list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the user.
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                   email:
 *                     type: string
 *                     description: The email address of the user.
 *       401:
 *         description: Unauthorized - Failed to retrieve user list.
 */

// Define an async function to be able to use await inside the loop
const fetchUserDetails = async (user:any) => {
  const config = {
    method: 'get',
    url: user.link.href,
    headers: {
      'Authorization': `Basic ${crowdCredentials}`,
      'Content-Type': 'application/json',
    }
  }
  const response = await axios.request(config);
  return parseXmlToJson(response.data);
};

router.get('/user-list', async (req, res) => {
  try {
    const configList = {
      method: 'get',
      url: `${process.env.CROWD_USER_LIST_URL}`,
      headers: {
        'Authorization': `Basic ${crowdCredentials}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.request(configList);
    const userList = (await parseXmlToJson(response.data)).users;

    let newUserList = [];
    // Iterate over the userList using an asynchronous for loop
    for (const user of userList) {
      try {
        const userDetails = await fetchUserDetails(user);
        const newUser = {
          uid: userDetails['name'],
          name: userDetails['display-name'],
          email: userDetails['email'],
        }
        if(userDetails['active'] === true){
          newUserList.push(newUser);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
    res.status(200).json(newUserList);
  } catch (error) {
    console.error('Error fetching user list:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;
