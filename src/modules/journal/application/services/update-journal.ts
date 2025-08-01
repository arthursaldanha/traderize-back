import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { User, Journal, Strategy } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';
import { IJournalRepository } from '@/repositories/journal';
import { IStrategyRepository } from '@/repositories/strategy';
import { UpdateJournalDTO } from '@/modules/journal/application/DTOs';

@injectable()
export class UpdateJournalService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,

    @inject(ioc.repositories.strategyRepository)
    private strategyRepository: IStrategyRepository,

    @inject(ioc.repositories.authRepository)
    private journalRepository: IJournalRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateJournalDTO & { user: User },
  ): Promise<Journal> {
    const isExistentAccount = await this.accountRepository.findById(
      data.accountId,
    );

    if (!isExistentAccount) {
      throw new CustomError({
        message: 'Conta não encontrada.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const tradeJournal = await this.journalRepository.findById(id);

    if (!tradeJournal) {
      throw new CustomError({
        message: 'Diário de trade não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    let strategies: Strategy[] = [];

    if (data.strategies.length) {
      strategies = await this.strategyRepository.listByIds(data.strategies);
    }

    tradeJournal.updateDetails({
      strategies,
      externalTradeId: '', // TODO AJUSTAR ISSO AQUI
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
      timeDateStart: data.tradeDate,
      notes: data.notes || null,
    });

    await this.journalRepository.update(tradeJournal);

    return tradeJournal;
  }
}
