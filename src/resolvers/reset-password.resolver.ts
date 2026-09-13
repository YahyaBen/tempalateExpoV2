import { z } from 'zod/v4';

export const resetPasswordSchema = z
  .object({
    /** New password – min 8, max 128 (mirrors ResetPasswordRequest). */
    newPassword: z
      .string()
      .min(8, 'auth.passwordMinLength')
      .max(128, 'auth.passwordMaxLength'),

    /** Must match newPassword. */
    confirmPassword: z.string(),
  })
  .check((ctx) => {
    if (ctx.value.newPassword !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value.confirmPassword,
        message: 'auth.passwordsMismatch',
        path: ['confirmPassword'],
      });
    }
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

