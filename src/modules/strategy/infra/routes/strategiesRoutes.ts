import { Router } from 'express';

import { isAuthenticated, parseDataWithSchema } from '@/middlewares';

import {
  createStrategySchema,
  updateStrategySchema,
} from '@/modules/strategy/application/DTOs';
import { StrategyController } from '@/modules/strategy/application/controllers/strategy';

const strategiesRoutes: Router = Router();

strategiesRoutes.get('/', isAuthenticated, StrategyController.listByUserId);

strategiesRoutes.get(
  '/:id',
  isAuthenticated,
  StrategyController.findByStrategyId,
);

strategiesRoutes.post(
  '/',
  parseDataWithSchema(createStrategySchema),
  isAuthenticated,
  StrategyController.create,
);

strategiesRoutes.put(
  '/:id',
  parseDataWithSchema(updateStrategySchema),
  isAuthenticated,
  StrategyController.update,
);

export { strategiesRoutes };
