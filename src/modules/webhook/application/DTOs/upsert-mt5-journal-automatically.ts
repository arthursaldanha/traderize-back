import { z } from 'zod';

const type = z.enum([
  'BUY',
  'SELL',
  'BALANCE',
  'CREDIT',
  'ADDITIONAL_CHARGE',
  'CORRECTION',
  'BONUS',
  'COMMISSION',
  'COMMISSION_DAILY',
  'COMMISSION_MONTHLY',
  'AGENT_DAILY',
  'AGENT_MONTHLY',
  'INTEREST',
  'BUY_CANCELED',
  'SELL_CANCELED',
  'DIVIDEND',
  'DIVIDEND_FRANKED',
  'TAX',
  'UNKNOWN',
]);

const entry = z.enum(['IN', 'OUT', 'INOUT', 'OUT_BY', 'UNKNOWN']);

const reason = z.enum([
  'CLIENT',
  'EXPERT',
  'WEB',
  'MOBILE',
  'STOP_LOSS',
  'TAKE_PROFIT',
  'STOP_OUT',
  'ROLLOVER',
  'VMARGIN',
  'SPLIT',
  'CORPORATE_ACTION',
  'UNKNOWN',
]);

export const dealSchema = z.object({
  accountId: z.number(),
  ticket: z.number(),
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
  type,
  entry,
  reason,
  orderId: z.number(),
  positionId: z.number(),
  magic: z.number(),
});

const upsertJournalAutoSchema = z.array(dealSchema);

type UpsertupsertJournalAutoDTO = z.infer<typeof upsertJournalAutoSchema>;

export { upsertJournalAutoSchema, type UpsertupsertJournalAutoDTO };
