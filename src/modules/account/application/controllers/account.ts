import { Request, Response } from 'express';

import { container } from '@/libs/container';

import {
  CreateAccountService,
  ListAccountsByUserIdService,
} from '@/modules/account/application/services';

export class AccountController {
  static async create(req: Request, res: Response) {
    const { user } = req;

    const account = await container
      .resolve(CreateAccountService)
      .execute({ user, ...req.body });

    res.status(201).json(account.toJSON());
  }

  static async listByUserId(req: Request, res: Response) {
    const accounts = await container
      .resolve(ListAccountsByUserIdService)
      .execute({ userId: req.user.id.getValue() });

    res.status(201).json(accounts.map((account) => account.toJSON()));
  }
}
