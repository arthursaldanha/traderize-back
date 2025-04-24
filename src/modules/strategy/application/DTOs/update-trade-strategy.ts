import { z } from 'zod';

const updateTradeStrategySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  description: z.string().nullable(),
  isDefault: z.boolean(),
  imageUrls: z.array(z.string().url()),
});

type UpdateTradeStrategyDTO = z.infer<typeof updateTradeStrategySchema>;

export { updateTradeStrategySchema, type UpdateTradeStrategyDTO };
