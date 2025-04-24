import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email('Invalid email format'),
  isEmailVerified: z.boolean().default(false),
  phone: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  planId: z.string().nullable(),
});

type RegisterDTO = z.infer<typeof registerSchema>;

export { registerSchema, type RegisterDTO };
