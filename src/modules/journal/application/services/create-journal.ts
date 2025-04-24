import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { TradeJournal, User } from '@/core/entities';
import { ITradeAccountRepository } from '@/repositories/account';
import { CreateJournalDTO } from '@/modules/journal/application/DTOs';
import { ITradeJournalRepository } from '@/repositories/journal/ITradeJournalRepository';

@injectable()
export class CreateJournalService {
  constructor(
    @inject(ioc.repositories.tradeAccountRepository)
    private tradeAccountRepository: ITradeAccountRepository,

    @inject(ioc.repositories.tradeJournalRepository)
    private tradeJournalRepository: ITradeJournalRepository,
  ) {}

  async execute(
    data: CreateJournalDTO & { user: User },
  ): Promise<TradeJournal> {
    const isExistentAccount = await this.tradeAccountRepository.findById(
      data.accountId,
    );

    if (!isExistentAccount) {
      throw new CustomError({
        message: 'Conta não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const tradeJournal = TradeJournal.create({
      accountId: data.accountId,
      strategyId: data.strategyId || null,
      asset: data.asset,
      entryPrice: data.entryPrice,
      stopPrice: data.stopPrice,
      takePrices: data.takePrices,
      investment: data.investment,
      lots: data.lots,
      result: data.result || null,
      riskRewardRatio: data.riskRewardRatio || null,
      status: data.status,
      imageUrls: [],
      direction: data.direction,
      tradeDate: data.tradeDate,
      notes: data.notes || null,
    });

    await this.tradeJournalRepository.create(tradeJournal);

    return tradeJournal;
  }
}
