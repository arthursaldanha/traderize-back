import { Journal } from '@/core/entities';

export interface IJournalRepository {
  create(journal: Journal): Promise<void>;
  createMany(journals: Journal[]): Promise<void>;
  findById(id: string, withDetails?: boolean): Promise<Journal | null>;
  findByExternalTradeId(params: {
    accountId: string;
    externalTradeId: string;
    withStrategy?: false;
    withDetails?: false;
  }): Promise<Journal | null>;
  listByAccountIdAndExternalTradeIds(params: {
    accountId: string;
    externalTradeIds: string[];
  }): Promise<Journal[] | null>;
  listByAccountId(accountId: string, withDetails?: boolean): Promise<Journal[]>;
  update(journal: Journal): Promise<void>;
  updateMany(journals: Journal[]): Promise<void>;
}
