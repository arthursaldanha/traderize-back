import { Market, Platform, TradeAccountCurrency } from '@prisma/client';
import { z } from 'zod';

const createTradeAccountSchema = z.object({
  market: z.array(z.nativeEnum(Market)),
  currency: z.nativeEnum(TradeAccountCurrency),
  platform: z.nativeEnum(Platform),
  isPropFirm: z.boolean(),
  broker: z.string().min(2, 'Broker name must be at least 2 characters long'),
  initialBalance: z
    .number()
    .positive('Initial balance must be greater than zero'),
  currentBalance: z
    .number()
    .positive('Current balance must be greater than zero'),
});

type CreateTradeAccountDTO = z.infer<typeof createTradeAccountSchema>;

export { createTradeAccountSchema, type CreateTradeAccountDTO };
