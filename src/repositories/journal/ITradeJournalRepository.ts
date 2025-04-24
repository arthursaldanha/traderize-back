import { TradeJournal } from '@/core/entities';

export interface ITradeJournalRepository {
  create(tradeJournal: TradeJournal): Promise<void>;
  findById(id: string): Promise<TradeJournal | null>;
  findByIdWithComments(id: string): Promise<TradeJournal | null>;
  listByAccountId(accountId: string): Promise<TradeJournal[]>;
  update(tradeJournal: TradeJournal): Promise<void>;
}
