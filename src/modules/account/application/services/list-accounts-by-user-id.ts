import { inject, injectable } from 'inversify';

import { ioc } from '@/ioc';
import { Account } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';
import { ListAccountsByUserIdDTO } from '@/modules/account/application/DTOs';

@injectable()
export class ListAccountsByUserIdService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,
  ) {}

  async execute({ userId }: ListAccountsByUserIdDTO): Promise<Account[]> {
    return await this.accountRepository.listByUserId(userId);
  }
}
