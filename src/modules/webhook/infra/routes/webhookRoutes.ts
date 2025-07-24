import { Router } from 'express';

import { parseDataWithSchema } from '@/middlewares';

import { upsertJournalAutoSchema } from '@/modules/webhook/application/DTOs';
import { WebhookController } from '@/modules/webhook/application/controllers/webhook';

const webhookRoutes: Router = Router();

webhookRoutes.post(
  '/mt5/upsert',
  parseDataWithSchema(upsertJournalAutoSchema),
  WebhookController.upsert,
);

export { webhookRoutes };
