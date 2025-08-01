import { Status, Direction } from '@prisma/client';
import { z } from 'zod';

const updateJournalSchema = z.object({
  accountId: z.string().uuid(),
  strategies: z.array(z.string().uuid()).default([]),
  entryPrice: z.number().positive('Entry price must be greater than zero'),
  stopPrice: z.number().positive('Stop price must be greater than zero'),
  takePrices: z.array(
    z.number().positive('Take price must be greater than zero'),
  ),
  investment: z.number().positive('Investment must be greater than zero'),
  lots: z.number().positive('Lots must be greater than zero'),
  result: z.number(),
  riskRewardRatio: z
    .number()
    .nonnegative('Risk-reward ratio must not be negative'),
  status: z.nativeEnum(Status),
  direction: z.nativeEnum(Direction),
  tradeDate: z.date(),
  notes: z.string().optional(),
});

type UpdateJournalDTO = z.infer<typeof updateJournalSchema>;

export { updateJournalSchema, type UpdateJournalDTO };
