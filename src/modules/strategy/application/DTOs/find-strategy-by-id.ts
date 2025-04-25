import { z } from 'zod';

const findStrategyByIdSchema = z.object({
  id: z.string().uuid(),
});

type FindStrategyByIdDTO = z.infer<typeof findStrategyByIdSchema>;

export { findStrategyByIdSchema, type FindStrategyByIdDTO };
