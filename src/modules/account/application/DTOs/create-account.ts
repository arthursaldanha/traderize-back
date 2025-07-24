import { z } from 'zod';
import { Market, Platform, AccountCurrency } from '@prisma/client';

const createAccountSchema = z.object({
  market: z.array(z.nativeEnum(Market)),
  currency: z.nativeEnum(AccountCurrency),
  platform: z.nativeEnum(Platform),
  isPropFirm: z.boolean(),
  broker: z.string().min(2, 'Broker name must be at least 2 characters long'),
  externalId: z
    .string()
    .min(2, 'External ID must be at least 2 characters long'),
  description: z.string().nullable(),
  initialBalance: z
    .number()
    .positive('Initial balance must be greater than zero'),
  currentBalance: z
    .number()
    .positive('Current balance must be greater than zero'),
  credits: z.number().nonnegative('Credit must be greater than zero'),
  disabled: z.boolean(),
});

type CreateAccountDTO = z.infer<typeof createAccountSchema>;

export { createAccountSchema, type CreateAccountDTO };
