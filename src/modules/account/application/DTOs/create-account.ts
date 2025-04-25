import { Market, Platform, AccountCurrency } from '@prisma/client';
import { z } from 'zod';

const createAccountSchema = z.object({
  market: z.array(z.nativeEnum(Market)),
  currency: z.nativeEnum(AccountCurrency),
  platform: z.nativeEnum(Platform),
  isPropFirm: z.boolean(),
  broker: z.string().min(2, 'Broker name must be at least 2 characters long'),
  initialBalance: z
    .number()
    .positive('Initial balance must be greater than zero'),
  currentBalance: z
    .number()
    .positive('Current balance must be greater than zero'),
  credits: z.number().positive('Credit must be greater than zero'),
  disabled: z.boolean(),
});

type CreateAccountDTO = z.infer<typeof createAccountSchema>;

export { createAccountSchema, type CreateAccountDTO };
