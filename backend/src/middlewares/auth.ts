import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../prisma/client.js";

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

const toUserRole = (role?: string) => {
  if (!role) return UserRole.USER;
  return Object.values(UserRole).includes(role as UserRole) ? (role as UserRole) : UserRole.USER;
};

const devEmailFor = (userId: string) => `${userId.replace(/[^a-zA-Z0-9._-]/g, "_")}@dev.trust-loans.local`;

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");
  if (userId) {
    const userRole = toUserRole(role);
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: devEmailFor(userId),
        name: userId,
        role: userRole,
        emailVerified: true,
      },
      update: { role: userRole },
    });
    req.user = { id: userId, role: userRole };
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

