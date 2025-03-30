import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types/express.js';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(404).json({ message: 'No token provided' });
      return;
    }

    const verifiedUser = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as CustomJWTPayload;

    if (!verifiedUser) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = verifiedUser;

    next();
  } catch (error) {
    next(error);
  }
}

export function roleGuard(roles: string[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(401).json({ message: 'Unauthorized access. Forbidden!' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
