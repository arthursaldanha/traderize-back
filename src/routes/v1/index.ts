import { Router } from 'express';

import { authRoutes } from '@/modules/auth/infra/routes/authRoutes';
import { userRoutes } from '@/modules/user/infra/routes/userRoutes';
import { webhookRoutes } from '@/modules/webhook/infra/routes/webhookRoutes';
import { accountRoutes } from '@/modules/account/infra/routes/accountRoutes';
import { journalRoutes } from '@/modules/journal/infra/routes/journalRoutes';
import { dashboardRoutes } from '@/modules/dashboard/infra/routes/dashboardRoutes';
import { strategiesRoutes } from '@/modules/strategy/infra/routes/strategiesRoutes';
import { subscriptionPlansRoutes } from '@/modules/subscription-plans/infra/routes/subscriptionPlansRoutes';

const routes: Router = Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/subscription-plans', subscriptionPlansRoutes);
routes.use('/accounts', accountRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/journal', journalRoutes);
routes.use('/strategies', strategiesRoutes);
routes.use('/webhooks', webhookRoutes);

export { routes };
