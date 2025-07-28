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
  listByAccountIds(params: {
    accountIds: string[];
    details: { withStrategy?: boolean; withMt5Transactions?: boolean };
  }): Promise<Journal[]>;
  update(journal: Journal): Promise<void>;
  updateMany(journals: Journal[]): Promise<void>;
}
