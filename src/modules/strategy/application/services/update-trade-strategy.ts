import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { TradeStrategy, type User } from '@/core/entities';
import { UpdateTradeStrategyDTO } from '@/modules/strategy/application/DTOs';
import { ITradeStrategyRepository } from '@/repositories/strategy/ITradeStrategyRepository';

@injectable()
export class UpdateTradeStrategyService {
  constructor(
    @inject(ioc.repositories.tradeStrategyRepository)
    private tradeStrategyRepository: ITradeStrategyRepository,
  ) {}

  async execute({
    user,
    id,
    name,
    description,
    imageUrls,
    isDefault,
  }: UpdateTradeStrategyDTO & { user: User }): Promise<TradeStrategy> {
    const allExistentStrategies =
      await this.tradeStrategyRepository.listByUserId(user.id.getValue());

    const strategy = allExistentStrategies.find(
      (plan) => plan.id.getValue() === id,
    );

    if (!strategy) {
      throw new CustomError({
        message: 'Estratégia não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isDuplicate = allExistentStrategies.some(
      (plan) =>
        plan.name.toLowerCase() === name.toLowerCase() &&
        plan.id.getValue() !== id,
    );

    if (isDuplicate) {
      throw new CustomError({
        message: 'Já existe uma estratégia com este nome.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const updatedStrategy = TradeStrategy.create({
      id: strategy.id.getValue(),
      userId: strategy.userId.getValue(),
      name: name ?? strategy.name,
      description: description ?? strategy.description,
      isDefault: isDefault ?? strategy.isDefault,
      imageUrls: imageUrls ?? strategy.imageUrls,
      createdAt: strategy.createdAt,
      updatedAt: new Date(),
    });

    await this.tradeStrategyRepository.update(updatedStrategy);

    return updatedStrategy;
  }
}
