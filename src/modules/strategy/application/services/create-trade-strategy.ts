import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { TradeStrategy, User } from '@/core/entities';
import { CreateTradeStrategyDTO } from '@/modules/strategy/application/DTOs';
import { ITradeStrategyRepository } from '@/repositories/strategy/ITradeStrategyRepository';

@injectable()
export class CreateTradeStrategyService {
  constructor(
    @inject(ioc.repositories.tradeStrategyRepository)
    private tradeStrategyRepository: ITradeStrategyRepository,
  ) {}

  async execute({
    user,
    name,
    description,
    isDefault,
    imageUrls,
  }: CreateTradeStrategyDTO & { user: User }): Promise<TradeStrategy> {
    const allExistentStrategies =
      await this.tradeStrategyRepository.listByUserId(user.id.getValue());

    const isDuplicate = allExistentStrategies.some(
      (plan) => plan.name.toLowerCase() === name.toLowerCase(),
    );

    if (isDuplicate) {
      throw new CustomError({
        message: 'Já existe uma estratégia com este nome.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const strategy = TradeStrategy.create({
      userId: user.id.getValue(),
      name,
      description,
      isDefault,
      imageUrls,
    });

    await this.tradeStrategyRepository.create(strategy);

    return strategy;
  }
}
