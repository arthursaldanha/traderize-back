import { inject, injectable } from 'inversify';

import { ioc } from '@/ioc';
import { Strategy } from '@/core/entities';
import { IStrategyRepository } from '@/repositories/strategy';
import { ListStrategiesByUserIdDTO } from '@/modules/strategy/application/DTOs';

@injectable()
export class ListStrategiesByUserIdService {
  constructor(
    @inject(ioc.repositories.strategyRepository)
    private strategyRepository: IStrategyRepository,
  ) {}

  async execute({ userId }: ListStrategiesByUserIdDTO): Promise<Strategy[]> {
    return await this.strategyRepository.listByUserId(userId);
  }
}
