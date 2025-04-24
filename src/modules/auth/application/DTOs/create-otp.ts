import { z } from 'zod';

const createOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  reason: z.string(),
});

type CreateOtpDTO = z.infer<typeof createOtpSchema>;

export { createOtpSchema, type CreateOtpDTO };
