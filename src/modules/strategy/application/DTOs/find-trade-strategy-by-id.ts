import { z } from 'zod';

const findTradeStrategyByIdSchema = z.object({
  id: z.string().uuid(),
});

type FindTradeStrategyByIdDTO = z.infer<typeof findTradeStrategyByIdSchema>;

export { findTradeStrategyByIdSchema, type FindTradeStrategyByIdDTO };
