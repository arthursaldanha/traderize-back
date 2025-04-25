import { Router } from 'express';

import { authRoutes } from '@/modules/auth/infra/routes/authRoutes';
import { accountRoutes } from '@/modules/account/infra/routes/accountRoutes';
import { journalRoutes } from '@/modules/journal/infra/routes/journalRoutes';
import { strategiesRoutes } from '@/modules/strategy/infra/routes/strategiesRoutes';
import { subscriptionPlansRoutes } from '@/modules/subscription-plans/infra/routes/subscriptionPlansRoutes';

const routes: Router = Router();

routes.use('/auth', authRoutes);
routes.use('/subscription-plans', subscriptionPlansRoutes);
routes.use('/accounts', accountRoutes);
routes.use('/journal', journalRoutes);
routes.use('/strategies', strategiesRoutes);

export { routes };
