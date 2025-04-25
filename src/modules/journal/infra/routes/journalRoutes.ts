import { Router } from 'express';

import { isAuthenticated, parseDataWithSchema } from '@/middlewares';

import {
  createJournalSchema,
  updateJournalSchema,
} from '@/modules/journal/application/DTOs';
import { JournalController } from '@/modules/journal/application/controllers/journal';

const journalRoutes: Router = Router();

journalRoutes.get(
  '/:id',
  parseDataWithSchema(createJournalSchema),
  isAuthenticated,
  JournalController.findByJournalId,
);

journalRoutes.get(
  '/account/:accountId',
  isAuthenticated,
  JournalController.listByAccountId,
);

journalRoutes.post(
  '/',
  parseDataWithSchema(createJournalSchema),
  isAuthenticated,
  JournalController.create,
);

journalRoutes.put(
  '/:id',
  parseDataWithSchema(updateJournalSchema),
  isAuthenticated,
  JournalController.update,
);

export { journalRoutes };
