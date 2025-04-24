import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { User, TradeJournal } from '@/core/entities';
import { ITradeAccountRepository } from '@/repositories/account';
import { UpdateJournalDTO } from '@/modules/journal/application/DTOs';
import { ITradeJournalRepository } from '@/repositories/journal/ITradeJournalRepository';

@injectable()
export class UpdateJournalService {
  constructor(
    @inject(ioc.repositories.tradeAccountRepository)
    private tradeAccountRepository: ITradeAccountRepository,

    @inject(ioc.repositories.authRepository)
    private tradeJournalRepository: ITradeJournalRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateJournalDTO & { user: User },
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

    const tradeJournal = await this.tradeJournalRepository.findById(id);

    if (!tradeJournal) {
      throw new CustomError({
        message: 'Diário de trade não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    tradeJournal.updateDetails({
      strategyId: data.strategyId || null,
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

    await this.tradeJournalRepository.update(tradeJournal);

    return tradeJournal;
  }
}
