import { TradeStatus, TradeDirection } from '@prisma/client';
import { z } from 'zod';

const createJournalSchema = z.object({
  accountId: z.string().uuid(),
  strategyId: z.string().uuid().nullable(),
  asset: z.string().min(1, 'Asset name must not be empty'),
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
  status: z.nativeEnum(TradeStatus),
  direction: z.nativeEnum(TradeDirection),
  tradeDate: z.coerce.date(),
  notes: z.string().optional(),
});

type CreateJournalDTO = z.infer<typeof createJournalSchema>;

export { createJournalSchema, type CreateJournalDTO };
