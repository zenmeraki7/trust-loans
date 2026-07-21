import { Router, type NextFunction, type Request, type Response } from "express";
import { env } from "../../config/env.js";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, reauthenticateSchema, resetPasswordSchema, signupSchema, tokenSchema } from "./auth.validators.js";
import { setPrivateNoStore } from "../../middlewares/privateResponse.js";

export const authRoutes = Router();

authRoutes.use((_req, res, next) => {
  setPrivateNoStore(res);
  next();
});

function requireTrustedOrigin(req: Request, _res: Response, next: NextFunction) {
  const originHeader = req.get("origin");
  const refererHeader = req.get("referer");
  let requestOrigin = originHeader;
  if (!requestOrigin && refererHeader) {
    try {
      requestOrigin = new URL(refererHeader).origin;
    } catch {
      requestOrigin = undefined;
    }
  }
  if (requestOrigin === env.publicAppOrigin) return next();
  next(new AppError("Request origin is not allowed.", 403));
}

authRoutes.get("/csrf", requireTrustedOrigin, authController.csrf);
authRoutes.get("/session", requireAction("account.read"), asyncHandler(authController.session));
authRoutes.post("/signup", requireTrustedOrigin, validate(signupSchema), asyncHandler(authController.signup));
authRoutes.post("/login", requireTrustedOrigin, validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/logout", requireTrustedOrigin, asyncHandler(authController.logout));
authRoutes.post("/logout-all", requireTrustedOrigin, requireAction("account.security"), asyncHandler(authController.logoutAll));
authRoutes.post("/reauthenticate", requireTrustedOrigin, requireAction("account.security"), validate(reauthenticateSchema), asyncHandler(authController.reauthenticate));
authRoutes.post("/change-password", requireTrustedOrigin, requireAction("account.security"), validate(changePasswordSchema), asyncHandler(authController.changePassword));
authRoutes.post("/forgot-password", requireTrustedOrigin, validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRoutes.post("/reset-password", requireTrustedOrigin, validate(resetPasswordSchema), asyncHandler(authController.resetPassword));
authRoutes.post("/verify-email", requireTrustedOrigin, validate(tokenSchema), asyncHandler(authController.verifyEmail));
authRoutes.post("/resend-verification", requireTrustedOrigin, validate(forgotPasswordSchema), asyncHandler(authController.resendVerification));
