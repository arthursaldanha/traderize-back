import { z } from 'zod';

import { Feature } from '@/modules/subscription-plans/domain/enums/feature';

const featureSchema = z.object({
  [Feature.TRADE_ACCOUNTS]: z.object({
    isAllowed: z.boolean(),
    limit: z.number().optional(),
  }),
  [Feature.TRADE_JOURNAL]: z.object({
    isAllowed: z.boolean(),
    historyDays: z.number().optional(),
  }),
  [Feature.LEARNING_LIST]: z.object({
    isAllowed: z.boolean(),
    limit: z.number().optional(),
  }),
  [Feature.PERFORMANCE_STATS]: z.object({
    isAllowed: z.boolean(),
    type: z.enum(['basic', 'middle', 'advanced']).optional(),
  }),
  [Feature.ECONOMIC_CALENDAR]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.RISK_CALCULATOR]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.PAIR_CORRELATION]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.CLASSES]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.COMMUNITY]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.RANKINGS]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.GOAL_SETTING]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.REWARDS]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.CUSTOM_ALERTS]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.DATA_EXPORT]: z.object({
    isAllowed: z.boolean(),
  }),
  [Feature.AI_REPORTS]: z.object({
    isAllowed: z.boolean(),
  }),
});

const subscriptionPlanSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().nonnegative(),
  features: featureSchema,
});

type SubscriptionPlanDTO = z.infer<typeof subscriptionPlanSchema>;

export { subscriptionPlanSchema, type SubscriptionPlanDTO };
