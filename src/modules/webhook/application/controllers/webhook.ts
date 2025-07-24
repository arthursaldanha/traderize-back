import { Request, Response } from 'express';

import { container } from '@/libs/container';

import { UpsertJournalByExternalTradeIdService } from '@/modules/webhook/application/services';

export class WebhookController {
  static async upsert(req: Request, res: Response) {
    const result = await container
      .resolve(UpsertJournalByExternalTradeIdService)
      .execute(req.body);

    return res.status(201).json(result);
  }
}
