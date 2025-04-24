import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '@/errors';
import { container } from '@/libs/container';

import {
  CreateSubscriptionPlanService,
  EditSubscriptionPlanService,
} from '@/modules/subscription-plans/application/services';

export class SubscriptionPlanController {
  static async create(req: Request, res: Response) {
    const plan = await container
      .resolve(CreateSubscriptionPlanService)
      .execute(req.body);

    res.status(201).json(plan.toJSON());
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new CustomError({
        message: 'É preciso passar o id do plano na URL.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const plan = await container
      .resolve(EditSubscriptionPlanService)
      .execute(id, req.body);

    res.status(201).json(plan.toJSON());
  }
}
