import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { TradeJournal } from '@/core/entities';
import { ITradeAccountRepository } from '@/repositories/account';
import { ListJournalsByAccountDTO } from '@/modules/journal/application/DTOs';
import { ITradeJournalRepository } from '@/repositories/journal/ITradeJournalRepository';

@injectable()
export class ListJournalByAccountIdService {
  constructor(
    @inject(ioc.repositories.tradeAccountRepository)
    private tradeAccountRepository: ITradeAccountRepository,

    @inject(ioc.repositories.authRepository)
    private tradeJournalRepository: ITradeJournalRepository,
  ) {}

  async execute({
    accountId,
  }: ListJournalsByAccountDTO): Promise<TradeJournal[]> {
    const isExistentAccount =
      await this.tradeAccountRepository.findById(accountId);

    if (!isExistentAccount) {
      throw new CustomError({
        message: 'Conta não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const tradeJournals = await this.tradeJournalRepository.listByAccountId(
      accountId,
    );

    return tradeJournals;
  }
}
