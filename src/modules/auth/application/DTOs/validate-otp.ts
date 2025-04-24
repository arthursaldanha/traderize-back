import { z } from 'zod';

const validateOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  token: z.string(),
});

type ValidateOtpDTO = z.infer<typeof validateOtpSchema>;

export { validateOtpSchema, type ValidateOtpDTO };
