import { z } from 'zod';

const createTradeStrategySchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  description: z.string().nullable().optional(),
  isDefault: z.boolean().optional(),
  imageUrls: z.array(z.string().url(), {
    message: 'Cada imagem deve ser uma URL válida',
  }),
});

type CreateTradeStrategyDTO = z.infer<typeof createTradeStrategySchema>;

export { createTradeStrategySchema, type CreateTradeStrategyDTO };
