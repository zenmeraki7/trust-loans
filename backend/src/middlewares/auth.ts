import { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { clearSessionCookie, sessionTokenFrom } from "../modules/auth/auth.cookies.js";
import { hashOpaqueToken } from "../modules/auth/auth.crypto.js";
import { prisma } from "../prisma/client.js";
import { setPrivateNoStore } from "./privateResponse.js";

export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const LAST_SEEN_WRITE_INTERVAL_MS = 5 * 60 * 1000;

export type AuthUser = {
  id: string;
  role: UserRole;
  sessionId: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = sessionTokenFrom(req);
    if (!token) {
      next();
      return;
    }

    const now = new Date();
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashOpaqueToken(token) },
      select: {
        id: true,
        sessionVersion: true,
        lastSeenAt: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            role: true,
            status: true,
            sessionVersion: true,
          },
        },
      },
    });

    const idle = session ? now.getTime() - session.lastSeenAt.getTime() >= SESSION_IDLE_TIMEOUT_MS : false;
    const invalid = !session || session.revokedAt !== null || session.expiresAt <= now || idle ||
      session.user.status !== "ACTIVE" || session.sessionVersion !== session.user.sessionVersion;

    if (invalid) {
      if (session && session.revokedAt === null) {
        await prisma.session.updateMany({
          where: { id: session.id, revokedAt: null },
          data: { revokedAt: now },
        });
      }
      clearSessionCookie(res);
      next();
      return;
    }

    req.user = {
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
    };

    if (now.getTime() - session.lastSeenAt.getTime() >= LAST_SEEN_WRITE_INTERVAL_MS) {
      await prisma.session.updateMany({
        where: {
          id: session.id,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { lastSeenAt: now },
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  setPrivateNoStore(res);
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  next();
};
