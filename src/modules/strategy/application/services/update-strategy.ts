import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { Strategy, type User } from '@/core/entities';
import { IStrategyRepository } from '@/repositories/strategy';
import { UpdateStrategyDTO } from '@/modules/strategy/application/DTOs';

@injectable()
export class UpdateStrategyService {
  constructor(
    @inject(ioc.repositories.strategyRepository)
    private strategyRepository: IStrategyRepository,
  ) {}

  async execute({
    user,
    id,
    name,
    description,
    imageUrls,
    isDefault,
  }: UpdateStrategyDTO & { user: User }): Promise<Strategy> {
    const allExistentStrategies = await this.strategyRepository.listByUserId(
      user.id.getValue(),
    );

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

    const updatedStrategy = Strategy.create({
      id: strategy.id.getValue(),
      userId: strategy.userId.getValue(),
      name: name ?? strategy.name,
      description: description ?? strategy.description,
      isDefault: isDefault ?? strategy.isDefault,
      imageUrls: imageUrls ?? strategy.imageUrls,
      createdAt: strategy.createdAt,
      updatedAt: new Date(),
    });

    await this.strategyRepository.update(updatedStrategy);

    return updatedStrategy;
  }
}
