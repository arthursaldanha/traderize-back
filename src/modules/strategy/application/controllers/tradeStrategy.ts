import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { container } from '@/libs/container';

import { CustomError } from '@/errors';
import {
  CreateTradeStrategyService,
  FindTradeStrategyByIdService,
  ListTradeStrategiesByUserIdService,
  UpdateTradeStrategyService,
} from '@/modules/strategy/application/services';

export class TradeStrategyController {
  static async create(req: Request, res: Response) {
    const { user } = req;

    const strategy = await container
      .resolve(CreateTradeStrategyService)
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
      .resolve(FindTradeStrategyByIdService)
      .execute({ id });

    res.status(201).json(strategy.toJSON());
  }

  static async listByUserId(req: Request, res: Response) {
    const strategies = await container
      .resolve(ListTradeStrategiesByUserIdService)
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
      .resolve(UpdateTradeStrategyService)
      .execute({ user, id, ...req.body });

    res.status(201).json(strategy.toJSON());
  }
}
