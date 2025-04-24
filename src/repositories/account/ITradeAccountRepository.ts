import { TradeAccount } from '@/core/entities/TradeAccount';

export interface ITradeAccountRepository {
  save(tradeAccount: TradeAccount): Promise<void>;
  findById(id: string): Promise<TradeAccount | null>;
  listByUserId(userId: string): Promise<TradeAccount[]>;
}
