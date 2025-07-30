import { Router } from 'express';

import { isAuthenticated } from '@/middlewares';

import { DashboardController } from '@/modules/dashboard/application/controllers/dashboard';

const dashboardRoutes: Router = Router();

dashboardRoutes.get('/', isAuthenticated, DashboardController.dashboard);

export { dashboardRoutes };
