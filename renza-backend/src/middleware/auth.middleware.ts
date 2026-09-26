import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractBearerToken } from '../utils/jwt';
import { sendUnauthorized } from '../utils/response';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractBearerToken(req.headers['authorization']);
    if (!token) {
      sendUnauthorized(res, 'No token provided. Please include a Bearer token in the Authorization header.');
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        sendUnauthorized(res, 'Token has expired. Please log in again.');
        return;
      }
      if (err.name === 'JsonWebTokenError') {
        sendUnauthorized(res, 'Invalid token. Please log in again.');
        return;
      }
    }
    sendUnauthorized(res, 'Authentication failed.');
  }
};
