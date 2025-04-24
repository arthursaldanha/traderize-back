import { Router } from 'express';

import {
  isAllowedRole,
  isAuthenticated,
  parseDataWithSchema,
} from '@/middlewares';

import { createTradeAccountSchema } from '@/modules/account/application/DTOs';
import { TradeAccountController } from '@/modules/account/application/controllers/tradeAccount';

const tradeAccountRoutes: Router = Router();

tradeAccountRoutes.post(
  '/',
  parseDataWithSchema(createTradeAccountSchema),
  isAuthenticated,
  isAllowedRole('ADMIN', 'USER'),
  TradeAccountController.create,
);

export { tradeAccountRoutes };
