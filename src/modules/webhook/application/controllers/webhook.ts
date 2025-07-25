import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '@/errors';
import { container } from '@/libs/container';

import { UpsertJournalByExternalTradeIdService } from '@/modules/webhook/application/services';

export class WebhookController {
  static async upsert(req: Request, res: Response) {
    const { 'user-id': userId, 'account-id': accountId } = req.headers;

    if (!userId && !accountId) {
      throw new CustomError({
        message: 'É preciso informar o USER_ID e ACCOUNT_ID',
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const result = await container
      .resolve(UpsertJournalByExternalTradeIdService)
      .execute({
        userId: String(userId),
        accountId: String(accountId),
        data: req.body,
      });

    return res.status(201).json(result);
  }
}
