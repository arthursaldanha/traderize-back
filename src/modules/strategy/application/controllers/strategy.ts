import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { container } from '@/libs/container';

import { CustomError } from '@/errors';
import {
  CreateStrategyService,
  FindStrategyByIdService,
  ListStrategiesByUserIdService,
  UpdateStrategyService,
} from '@/modules/strategy/application/services';

export class StrategyController {
  static async create(req: Request, res: Response) {
    const { user } = req;

    const strategy = await container
      .resolve(CreateStrategyService)
      .execute({ user, ...req.body });

    res.status(201).json(strategy.toJSON());
  }

  static async findByStrategyId(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new CustomError({
        message: 'É preciso passar o id da estratégia para obter os detalhes.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const strategy = await container
      .resolve(FindStrategyByIdService)
      .execute({ id });

    res.status(201).json(strategy.toJSON());
  }

  static async listByUserId(req: Request, res: Response) {
    const strategies = await container
      .resolve(ListStrategiesByUserIdService)
      .execute({ userId: req.user.id.getValue() });

    res.status(201).json(strategies.map((strategy) => strategy.toJSON()));
  }

  static async update(req: Request, res: Response) {
    const { user } = req;
    const { id } = req.params;

    if (!id) {
      throw new CustomError({
        message: 'É preciso passar o id da estratégia para atualizar.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const strategy = await container
      .resolve(UpdateStrategyService)
      .execute({ user, id, ...req.body });

    res.status(201).json(strategy.toJSON());
  }
}
