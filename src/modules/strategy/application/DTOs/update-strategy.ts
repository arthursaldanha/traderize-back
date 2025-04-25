import { z } from 'zod';

const updateStrategySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  description: z.string().nullable(),
  isDefault: z.boolean(),
  imageUrls: z.array(z.string().url()),
});

type UpdateStrategyDTO = z.infer<typeof updateStrategySchema>;

export { updateStrategySchema, type UpdateStrategyDTO };
