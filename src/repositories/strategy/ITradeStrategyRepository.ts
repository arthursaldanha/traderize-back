import { TradeStrategy } from '@/core/entities';

export interface ITradeStrategyRepository {
  create(tradeStrategy: TradeStrategy): Promise<void>;
  findById(id: string): Promise<TradeStrategy | null>;
  listByUserId(userId: string): Promise<TradeStrategy[]>;
  update(tradeStrategy: TradeStrategy): Promise<void>;
}
