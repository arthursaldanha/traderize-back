import { inject, injectable } from 'inversify';

import { ioc } from '@/ioc';
import { TradeStrategy } from '@/core/entities';
import { ListTradeStrategiesByUserIdDTO } from '@/modules/strategy/application/DTOs';
import { ITradeStrategyRepository } from '@/repositories/strategy/ITradeStrategyRepository';

@injectable()
export class ListTradeStrategiesByUserIdService {
  constructor(
    @inject(ioc.repositories.tradeStrategyRepository)
    private tradeStrategyRepository: ITradeStrategyRepository,
  ) {}

  async execute({
    userId,
  }: ListTradeStrategiesByUserIdDTO): Promise<TradeStrategy[]> {
    return await this.tradeStrategyRepository.listByUserId(userId);
  }
}
