import { Account } from '@/core/entities/Account';

export interface IAccountRepository {
  save(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findByUserIdAndExternalId({
    userId,
    externalId,
  }: {
    userId: string;
    externalId: string;
  }): Promise<Account | null>;
  listByUserId(userId: string): Promise<Account[]>;
}
