import { z } from "zod";
import { normalizeEmail } from "./auth.email.js";

const normalizeName = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").trim();

const emailSchema = z.string().max(320).transform((value) => value.trim()).superRefine((value, context) => {
  try {
    const normalizedEmail = normalizeEmail(value);
    if (!z.string().email().safeParse(normalizedEmail).success) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid email address." });
    }
  } catch {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid email address." });
  }
});

const loginPasswordSchema = z.string()
  .min(1)
  .max(128)
  .refine((value) => !/[\u0000-\u001F\u007F]/.test(value), "Password cannot include control characters.");

const newPasswordSchema = z.string()
  .min(12, "Password must be at least 12 characters.")
  .max(128, "Password must be no more than 128 characters.")
  .refine((value) => !/[\u0000-\u001F\u007F]/.test(value), "Password cannot include control characters.");

const optionalNameSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const normalized = normalizeName(value);
    return normalized || undefined;
  },
  z.string().min(2).max(120).optional(),
);

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: loginPasswordSchema,
  }).strict(),
});

export const signupSchema = z.object({
  body: z.object({
    name: optionalNameSchema,
    email: emailSchema,
    password: newPasswordSchema,
  }).strict(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }).strict(),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().trim().min(32).max(200),
    password: newPasswordSchema,
  }).strict(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: loginPasswordSchema,
    newPassword: newPasswordSchema,
  }).strict(),
});

export const reauthenticateSchema = z.object({
  body: z.object({
    password: loginPasswordSchema,
  }).strict(),
});

export const tokenSchema = z.object({
  body: z.object({
    token: z.string().trim().min(32).max(200),
  }).strict(),
});

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = LoginInput & {
  name?: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ReauthenticateInput = {
  password: string;
};

export type TokenInput = {
  token: string;
};
