import { Request, Response } from 'express';

import { container } from '@/libs/container';

import { CreateTradeAccountService } from '@/modules/account/application/services';

export class TradeAccountController {
  static async create(req: Request, res: Response) {
    const { user } = req;

    const account = await container
      .resolve(CreateTradeAccountService)
      .execute({ user, ...req.body });

    res.status(201).json(account.toJSON());
  }
}
