import type { Request, Response } from "express";
import { cookieValueFrom } from "./auth.cookies.js";

export const CSRF_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-borrowscope_csrf"
  : "borrowscope_csrf";

const csrfCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  path: "/",
};

export const csrfTokenFromCookie = (req: Request) =>
  cookieValueFrom(req.header("cookie"), CSRF_COOKIE_NAME);

export const setCsrfCookie = (res: Response, token: string, expiresAt: string) => {
  const expires = new Date(expiresAt);
  res.cookie(CSRF_COOKIE_NAME, token, {
    ...csrfCookieOptions,
    expires,
    maxAge: Math.max(0, expires.getTime() - Date.now()),
  });
};
