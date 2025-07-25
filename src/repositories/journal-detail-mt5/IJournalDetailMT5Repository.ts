import { JournalDetailMT5 } from '@/core/entities';

export interface IJournalDetailMT5Repository {
  create(detail: JournalDetailMT5): Promise<void>;
  createMany(details: JournalDetailMT5[]): Promise<void>;
  findById(id: string): Promise<JournalDetailMT5 | null>;
  findManyByAccountExternalTradeIdAndTickets(params: {
    accountId: string;
    positionId: string;
    tickets: number[];
  }): Promise<JournalDetailMT5[]>;
  listByExternalTradeId(
    accountId: string,
    externalTradeId: string,
  ): Promise<JournalDetailMT5[]>;
  listByAccountId(accountId: string): Promise<JournalDetailMT5[]>;
  deleteById(id: string): Promise<void>;
}
