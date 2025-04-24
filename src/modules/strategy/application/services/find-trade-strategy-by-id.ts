import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { TradeStrategy } from '@/core/entities';
import { FindTradeStrategyByIdDTO } from '@/modules/strategy/application/DTOs';
import { ITradeStrategyRepository } from '@/repositories/strategy/ITradeStrategyRepository';

@injectable()
export class FindTradeStrategyByIdService {
  constructor(
    @inject(ioc.repositories.tradeStrategyRepository)
    private tradeStrategyRepository: ITradeStrategyRepository,
  ) {}

  async execute({ id }: FindTradeStrategyByIdDTO): Promise<TradeStrategy> {
    const strategy = await this.tradeStrategyRepository.findById(id);

    if (!strategy) {
      throw new CustomError({
        message: 'Estratégia não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return strategy;
  }
}
