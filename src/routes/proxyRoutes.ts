import express from 'express';
import axios from 'axios';
import verifyJwt from '../helpers/verifyJwt';
import httpProxy from 'http-proxy';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const proxy = httpProxy.createProxyServer();

const proxyMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const targetUrl = process.env.API_URL;
    const response = await axios({ method: req.method, url: `${targetUrl}${req.url}`, data: req.body });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.use('/api', proxyMiddleware);

router.use('/app', verifyJwt, (req, res) => {
  req.url = req.originalUrl; // Preserve the original URL
  proxy.web(req, res, { target: process.env.APP_URL });
});

router.get('/', verifyJwt, (req, res) => {
  return res.redirect('/app')
});

export default router;
