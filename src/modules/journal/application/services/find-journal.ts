import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { TradeJournal } from '@/core/entities';
import { FindJournalByIdDTO } from '@/modules/journal/application/DTOs';
import { ITradeJournalRepository } from '@/repositories/journal/ITradeJournalRepository';

@injectable()
export class FindJournalByIdService {
  constructor(
    @inject(ioc.repositories.authRepository)
    private tradeJournalRepository: ITradeJournalRepository,
  ) {}

  async execute({ id }: FindJournalByIdDTO): Promise<TradeJournal> {
    const journal = await this.tradeJournalRepository.findById(id);

    if (!journal) {
      throw new CustomError({
        message: 'Diário de trade não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return journal;
  }
}
