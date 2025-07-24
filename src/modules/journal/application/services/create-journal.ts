import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { Journal, User } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';
import { IJournalRepository } from '@/repositories/journal';
import { CreateJournalDTO } from '@/modules/journal/application/DTOs';

@injectable()
export class CreateJournalService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,

    @inject(ioc.repositories.journalRepository)
    private journalRepository: IJournalRepository,
  ) {}

  async execute(data: CreateJournalDTO & { user: User }): Promise<Journal> {
    const isExistentAccount = await this.accountRepository.findById(
      data.accountId,
    );

    if (!isExistentAccount) {
      throw new CustomError({
        message: 'Conta não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const tradeJournal = Journal.create({
      accountId: data.accountId,
      strategyId: data.strategyId || null,
      externalTradeId: '', // TODO AJUSTAR ISSO AQUI
      symbol: data.asset,
      entryPrice: String(data.entryPrice),
      stopPrice: String(data.stopPrice),
      takePrices: data.takePrices.map(String),
      investment: String(data.investment),
      lots: String(data.lots),
      result: String(data.result) || null,
      riskRewardRatio: String(data.riskRewardRatio) || null,
      status: data.status,
      imageUrls: [],
      direction: data.direction,
      timeDateStart: data.tradeDate,
      notes: data.notes || null,
    });

    await this.journalRepository.create(tradeJournal);

    return tradeJournal;
  }
}
