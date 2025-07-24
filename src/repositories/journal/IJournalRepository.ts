import { Journal } from '@/core/entities';

export interface IJournalRepository {
  create(journal: Journal): Promise<void>;
  findById(id: string): Promise<Journal | null>;
  findByExternalTradeId(externalTradeId: string): Promise<Journal | null>;
  listByAccountId(accountId: string): Promise<Journal[]>;
  update(journal: Journal): Promise<void>;
}
