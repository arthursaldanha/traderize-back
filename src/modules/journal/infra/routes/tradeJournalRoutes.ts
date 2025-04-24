import { Router } from 'express';

import { isAuthenticated, parseDataWithSchema } from '@/middlewares';

import {
  createJournalSchema,
  updateJournalSchema,
} from '@/modules/journal/application/DTOs';
import { TradeJournalController } from '@/modules/journal/application/controllers/journal';

const tradeJournalRoutes: Router = Router();

tradeJournalRoutes.get(
  '/:id',
  parseDataWithSchema(createJournalSchema),
  isAuthenticated,
  TradeJournalController.findByJournalId,
);

tradeJournalRoutes.get(
  '/account/:accountId',
  isAuthenticated,
  TradeJournalController.listByAccountId,
);

tradeJournalRoutes.post(
  '/',
  parseDataWithSchema(createJournalSchema),
  isAuthenticated,
  TradeJournalController.create,
);

tradeJournalRoutes.put(
  '/:id',
  parseDataWithSchema(updateJournalSchema),
  isAuthenticated,
  TradeJournalController.update,
);

export { tradeJournalRoutes };
