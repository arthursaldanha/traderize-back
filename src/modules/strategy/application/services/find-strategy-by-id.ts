import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { Strategy } from '@/core/entities';
import { IStrategyRepository } from '@/repositories/strategy';
import { FindStrategyByIdDTO } from '@/modules/strategy/application/DTOs';

@injectable()
export class FindStrategyByIdService {
  constructor(
    @inject(ioc.repositories.strategyRepository)
    private strategyRepository: IStrategyRepository,
  ) {}

  async execute({ id }: FindStrategyByIdDTO): Promise<Strategy> {
    const strategy = await this.strategyRepository.findById(id);

    if (!strategy) {
      throw new CustomError({
        message: 'Estratégia não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return strategy;
  }
}
