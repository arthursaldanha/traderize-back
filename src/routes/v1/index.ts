import { Router } from 'express';

import { authRoutes } from '@/modules/auth/infra/routes/authRoutes';
import { tradeAccountRoutes } from '@/modules/account/infra/routes/tradeAccountRoutes';
import { tradeJournalRoutes } from '@/modules/journal/infra/routes/tradeJournalRoutes';
import { tradeStrategiesRoutes } from '@/modules/strategy/infra/routes/tradeStrategyRoutes';
import { subscriptionPlansRoutes } from '@/modules/subscription-plans/infra/routes/subscriptionPlansRoutes';

const routes: Router = Router();

routes.use('/auth', authRoutes);
routes.use('/subscription-plans', subscriptionPlansRoutes);
routes.use('/accounts', tradeAccountRoutes);
routes.use('/journal', tradeJournalRoutes);
routes.use('/strategies', tradeStrategiesRoutes);

export { routes };
