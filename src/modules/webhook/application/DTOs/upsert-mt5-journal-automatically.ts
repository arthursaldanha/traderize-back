import { z } from 'zod';

import {
  MT5DealTypeToDomain,
  MT5DealEntryToDomain,
  MT5DealReasonToDomain,
} from '@/modules/webhook/domain/enums';

export const dealSchema = z.object({
  ticket: z.number().transform(String),
  symbol: z.string(),
  comment: z.string(),
  lots: z.number(),
  entryPrice: z.number(),
  stopPrice: z.number().optional().default(0),
  takePrice: z.number().optional().default(0),
  investment: z.number().optional(),
  riskRewardRatio: z.number().optional(),
  result: z.number(),
  commission: z.number(),
  swap: z.number(),
  fee: z.number(),
  time: z.string(),
  type: z.string().transform((val) => MT5DealTypeToDomain[val] || 'UNKNOWN'),
  entry: z.string().transform((val) => MT5DealEntryToDomain[val] || 'UNKNOWN'),
  reason: z
    .string()
    .transform((val) => MT5DealReasonToDomain[val] || 'UNKNOWN'),
  orderId: z.number().transform(String),
  positionId: z.number().transform(String),
  magic: z.number().transform(String),
});

const upsertJournalAutoSchema = z.array(dealSchema);

type UpsertupsertJournalAutoDTO = z.infer<typeof upsertJournalAutoSchema>;

export { upsertJournalAutoSchema, type UpsertupsertJournalAutoDTO };
