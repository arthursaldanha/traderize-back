import { Request, Response } from 'express';

import { container } from '@/libs/container';

import {
  CreateJournalService,
  FindJournalByIdService,
  ListJournalByAccountIdService,
  UpdateJournalService,
} from '@/modules/journal/application/services';
import { CustomError } from '@/errors';
import { StatusCodes } from 'http-status-codes';

export class TradeJournalController {
  static async create(req: Request, res: Response) {
    const { user } = req;

    const journal = await container
      .resolve(CreateJournalService)
      .execute({ user, ...req.body });

    res.status(201).json(journal.toJSON());
  }

  static async findByJournalId(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new CustomError({
        message:
          'É preciso passar o id do diário de negociação na URL para obter os detalhes.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const journal = await container
      .resolve(FindJournalByIdService)
      .execute({ id });

    res.status(201).json(journal.toJSON());
  }

  static async listByAccountId(req: Request, res: Response) {
    const { accountId } = req.params;

    if (!accountId) {
      throw new CustomError({
        message:
          'É preciso passar o id da conta na URL para obter os registros de negociação.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const journals = await container
      .resolve(ListJournalByAccountIdService)
      .execute({ accountId });

    res.status(201).json(journals.map((journal) => journal.toJSON()));
  }

  static async update(req: Request, res: Response) {
    const { user } = req;
    const { id } = req.params;

    if (!id) {
      throw new CustomError({
        message: 'É preciso passar o id do plano na URL.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const journal = await container
      .resolve(UpdateJournalService)
      .execute(id, { user, ...req.body });

    res.status(201).json(journal.toJSON());
  }
}
