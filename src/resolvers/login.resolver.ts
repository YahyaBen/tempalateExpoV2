import { z } from 'zod/v4';

export const loginSchema = z.object({
  /** Email address or username – min 3, max 256 (mirrors LoginRequest). */
  login: z
    .string()
    .min(3, 'auth.identityMinLength')
    .max(256, 'auth.identityMaxLength'),

  /** Password – min 8, max 128. */
  password: z
    .string()
    .min(8, 'auth.passwordMinLength')
    .max(128, 'auth.passwordMaxLength'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

