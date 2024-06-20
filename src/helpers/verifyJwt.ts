import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomSession } from '../routes/authRoutes';

interface DecodedJwtPayload extends JwtPayload {
  userId: string;
}

function isCustomSession(session: any): session is CustomSession {
  return session && typeof session === 'object' && 'user' in session;
}

const verifyJwt = (req: express.Request & { userId?: string }, res: express.Response, next: express.NextFunction) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return res.redirect('/auth/login?message=not-logged-in-or-expired-session');
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'eZgAl+XqTNW0skN85crbMQ==') as DecodedJwtPayload;

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.redirect('/auth/login?message=not-logged-in-or-expired-session');
    }

    // Check if session data is present and if user is authenticated
    if (!isCustomSession(req.session) || !req.session.user || !req.session.user.uid) {
      return res.redirect('/auth/login?message=not-logged-in-or-expired-session');
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if ((error as any).code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Service Unavailable - Connection Refused' });
    }
    return res.redirect('/auth/login?message=not-logged-in-or-expired-session');
  }
};

export default verifyJwt;
