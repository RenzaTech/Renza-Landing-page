import { Request, Response, NextFunction } from 'express';
import { sendForbidden, sendUnauthorized } from '../utils/response';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    sendUnauthorized(res, 'Authentication required.');
    return;
  }
  if (req.user.role !== 'admin') {
    sendForbidden(res, 'Access denied. Admin privileges required.');
    return;
  }
  next();
};
