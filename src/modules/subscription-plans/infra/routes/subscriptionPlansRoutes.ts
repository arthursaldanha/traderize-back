import { Router } from 'express';

import { isAllowedRole, isAuthenticated, parseDataWithSchema } from '@/middlewares';

import { subscriptionPlanSchema } from '@/modules/subscription-plans/application/DTOs';
import { SubscriptionPlanController } from '@/modules/subscription-plans/application/controllers/subscriptionPlan';

const subscriptionPlansRoutes: Router = Router();

subscriptionPlansRoutes.post(
  '/',
  parseDataWithSchema(subscriptionPlanSchema),
  isAuthenticated,
  isAllowedRole('ADMIN'),
  SubscriptionPlanController.create,
);

subscriptionPlansRoutes.put(
  '/:id',
  parseDataWithSchema(subscriptionPlanSchema),
  isAuthenticated,
  isAllowedRole('ADMIN'),
  SubscriptionPlanController.update,
);

export { subscriptionPlansRoutes };
