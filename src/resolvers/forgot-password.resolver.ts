import { z } from 'zod/v4';

export const forgotPasswordSchema = z.object({
  /** Must be a valid e-mail address. */
  email: z.email('auth.invalidEmail').max(256, 'auth.emailMaxLength'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

