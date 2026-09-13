import { z } from 'zod/v4';

export const registerSchema = z
  .object({
    /** Display username – min 3, max 50 (mirrors RegisterRequest). */
    userName: z
      .string()
      .min(3, 'auth.usernameMinLength')
      .max(50, 'auth.usernameMaxLength'),

    /** Optional – max 100. */
    firstName: z.string().max(100, 'auth.firstNameMaxLength').optional(),

    /** Optional – max 100. */
    lastName: z.string().max(100, 'auth.lastNameMaxLength').optional(),

    /** Must be a valid e-mail, max 256. */
    email: z
      .email('auth.invalidEmail')
      .max(256, 'auth.emailMaxLength'),

    /** Password – min 8, max 128. */
    password: z
      .string()
      .min(8, 'auth.passwordMinLength')
      .max(128, 'auth.passwordMaxLength'),

    /** Must match password. */
    confirmPassword: z.string(),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value.confirmPassword,
        message: 'auth.passwordsMismatch',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

