import type { Request, Response } from "express";
import { clearSessionCookie, sessionTokenFrom, setSessionCookie } from "./auth.cookies.js";
import { authService } from "./auth.service.js";
import { createCsrfToken } from "./auth.crypto.js";
import { setCsrfCookie } from "./csrf.cookies.js";

const contextFrom = (req: Request) => ({
  requestId: req.requestId,
  ip: req.ip,
  userAgent: req.get("user-agent"),
  currentSessionToken: sessionTokenFrom(req) || undefined,
  botChallengeToken: req.get("x-turnstile-token") || undefined,
});
const establishSession = (res: Response, result: { token: string; expiresAt: string }) => {
  setSessionCookie(res, result.token, result.expiresAt);
  const { token: _token, ...safeResult } = result;
  return safeResult;
};

export const authController = {
  csrf(_req: Request, res: Response) {
    const result = createCsrfToken();
    setCsrfCookie(res, result.token, result.expiresAt);
    res.json({ csrfToken: result.token, expiresAt: result.expiresAt });
  },

  async signup(req: Request, res: Response) {
    res.status(202).json(await authService.signup(req.body, contextFrom(req)));
  },

  async resendVerification(req: Request, res: Response) {
    res.json(await authService.resendVerification(req.body, contextFrom(req)));
  },

  async verifyEmail(req: Request, res: Response) {
    const result = await authService.verifyEmail(req.body, contextFrom(req));
    res.json(establishSession(res, result));
  },

  async forgotPassword(req: Request, res: Response) {
    res.json(await authService.forgotPassword(req.body, contextFrom(req)));
  },

  async resetPassword(req: Request, res: Response) {
    const result = await authService.resetPassword(req.body, contextFrom(req));
    res.json(establishSession(res, result));
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body, contextFrom(req));
    res.json(establishSession(res, result));
  },

  async changePassword(req: Request, res: Response) {
    const result = await authService.changePassword(req.user!.id, req.user!.sessionId, req.body, contextFrom(req));
    res.json(establishSession(res, result));
  },

  async reauthenticate(req: Request, res: Response) {
    res.json(await authService.reauthenticate(req.user!.id, req.user!.sessionId, req.body, contextFrom(req)));
  },

  async logout(req: Request, res: Response) {
    await authService.logout(sessionTokenFrom(req), req.user?.id, req.user?.sessionId, contextFrom(req));
    clearSessionCookie(res);
    res.status(204).send();
  },

  async logoutAll(req: Request, res: Response) {
    await authService.logoutAll(req.user!.id, contextFrom(req));
    clearSessionCookie(res);
    res.status(204).send();
  },

  async session(req: Request, res: Response) {
    const user = await authService.getSessionUser(req.user!.id);
    if (!user) {
      clearSessionCookie(res);
      res.status(401).json({ message: "Session is no longer valid." });
      return;
    }
    res.json({ user });
  },
};
