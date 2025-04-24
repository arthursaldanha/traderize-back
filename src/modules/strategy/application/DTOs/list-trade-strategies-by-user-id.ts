import { z } from 'zod';

const listTradeStrategiesByUserIdSchema = z.object({
  userId: z.string().uuid(),
});

type ListTradeStrategiesByUserIdDTO = z.infer<typeof listTradeStrategiesByUserIdSchema>;

export { listTradeStrategiesByUserIdSchema, type ListTradeStrategiesByUserIdDTO };
