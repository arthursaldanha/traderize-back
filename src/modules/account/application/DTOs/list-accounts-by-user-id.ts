import { z } from 'zod';

const listAccountsByUserIdSchema = z.object({
  userId: z.string(),
});

type ListAccountsByUserIdDTO = z.infer<typeof listAccountsByUserIdSchema>;

export { listAccountsByUserIdSchema, type ListAccountsByUserIdDTO };
