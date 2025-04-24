import { Router } from 'express';

import { isAuthenticated, parseDataWithSchema } from '@/middlewares';

import {
  createTradeStrategySchema,
  updateTradeStrategySchema,
} from '@/modules/strategy/application/DTOs';
import { TradeStrategyController } from '@/modules/strategy/application/controllers/tradeStrategy';

const tradeStrategiesRoutes: Router = Router();

tradeStrategiesRoutes.get(
  '/',
  isAuthenticated,
  TradeStrategyController.listByUserId,
);

tradeStrategiesRoutes.get(
  '/:id',
  isAuthenticated,
  TradeStrategyController.findByStrategyId,
);

tradeStrategiesRoutes.post(
  '/',
  parseDataWithSchema(createTradeStrategySchema),
  isAuthenticated,
  TradeStrategyController.create,
);

tradeStrategiesRoutes.put(
  '/:id',
  parseDataWithSchema(updateTradeStrategySchema),
  isAuthenticated,
  TradeStrategyController.update,
);

export { tradeStrategiesRoutes };
