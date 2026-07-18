import type { NextFunction, Request, Response } from "express";

export const requireRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Insufficient role permissions" });
      return;
    }
    next();
  };

