import { Request, Response, NextFunction } from 'express';

export function roleGuard(role: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== role) {
        res.status(401).json({ message: 'Unauthorized access. Forbidden!' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
