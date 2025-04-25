import { z } from 'zod';

const listStrategiesByUserIdSchema = z.object({
  userId: z.string().uuid(),
});

type ListStrategiesByUserIdDTO = z.infer<typeof listStrategiesByUserIdSchema>;

export { listStrategiesByUserIdSchema, type ListStrategiesByUserIdDTO };
