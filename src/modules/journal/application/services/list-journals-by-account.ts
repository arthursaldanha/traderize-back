import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { Journal } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';
import { IJournalRepository } from '@/repositories/journal';
import { ListJournalsByAccountDTO } from '@/modules/journal/application/DTOs';

@injectable()
export class ListJournalByAccountIdService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,

    @inject(ioc.repositories.authRepository)
    private journalRepository: IJournalRepository,
  ) {}

  async execute({ accountId }: ListJournalsByAccountDTO): Promise<Journal[]> {
    const isExistentAccount = await this.accountRepository.findById(accountId);

    if (!isExistentAccount) {
      throw new CustomError({
        message: 'Conta não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const tradeJournals =
      await this.journalRepository.listByAccountId(accountId);

    return tradeJournals;
  }
}
