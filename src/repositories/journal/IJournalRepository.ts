import { Journal } from '@/core/entities';

export interface IJournalRepository {
  create(journal: Journal): Promise<void>;
  findById(id: string, withDetails?: boolean): Promise<Journal | null>;
  findByExternalTradeId(
    externalTradeId: string,
    accountId: string,
    withDetails?: boolean,
  ): Promise<Journal | null>;
  listByAccountId(accountId: string, withDetails?: boolean): Promise<Journal[]>;
  update(journal: Journal): Promise<void>;
}
