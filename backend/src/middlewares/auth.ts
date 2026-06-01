import type { NextFunction, Request, Response } from "express";

export type AuthUser = {
  id: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");
  if (userId) {
    req.user = { id: userId, role: role ?? "USER" };
  }
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  next();
};

