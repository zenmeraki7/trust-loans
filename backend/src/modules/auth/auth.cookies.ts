import type { Request, Response } from "express";

export const SESSION_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-borrowscope_session"
  : "borrowscope_session";

const legacyCookieName = "trust_loans_session";

export const cookieValueFrom = (cookieHeader: string | undefined, key: string) =>
  cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`))
    ?.slice(key.length + 1) ?? "";

export const sessionTokenFrom = (req: Request) =>
  cookieValueFrom(req.header("cookie"), SESSION_COOKIE_NAME) || cookieValueFrom(req.header("cookie"), legacyCookieName);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const setSessionCookie = (res: Response, token: string, expiresAt: string) => {
  const expires = new Date(expiresAt);
  res.cookie(SESSION_COOKIE_NAME, token, { ...cookieOptions, expires, maxAge: Math.max(0, expires.getTime() - Date.now()) });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
  res.clearCookie(legacyCookieName, cookieOptions);
};
