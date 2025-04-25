import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { Strategy, User } from '@/core/entities';
import { CreateStrategyDTO } from '@/modules/strategy/application/DTOs';
import { IStrategyRepository } from '@/repositories/strategy';

@injectable()
export class CreateStrategyService {
  constructor(
    @inject(ioc.repositories.strategyRepository)
    private strategyRepository: IStrategyRepository,
  ) {}

  async execute({
    user,
    name,
    description,
    isDefault,
    imageUrls,
  }: CreateStrategyDTO & { user: User }): Promise<Strategy> {
    const allExistentStrategies =
      await this.strategyRepository.listByUserId(user.id.getValue());

    const isDuplicate = allExistentStrategies.some(
      (plan) => plan.name.toLowerCase() === name.toLowerCase(),
    );

    if (isDuplicate) {
      throw new CustomError({
        message: 'Já existe uma estratégia com este nome.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const strategy = Strategy.create({
      userId: user.id.getValue(),
      name,
      description,
      isDefault,
      imageUrls,
    });

    await this.strategyRepository.create(strategy);

    return strategy;
  }
}
