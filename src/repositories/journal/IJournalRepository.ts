import { Journal } from '@/core/entities';

export interface IJournalRepository {
  create(journal: Journal): Promise<void>;
  findById(id: string): Promise<Journal | null>;
  findByIdWithComments(id: string): Promise<Journal | null>;
  listByAccountId(accountId: string): Promise<Journal[]>;
  update(journal: Journal): Promise<void>;
}
