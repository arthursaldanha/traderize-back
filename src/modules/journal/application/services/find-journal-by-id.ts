import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { Journal } from '@/core/entities';
import { IJournalRepository } from '@/repositories/journal';
import { FindJournalByIdDTO } from '@/modules/journal/application/DTOs';

@injectable()
export class FindJournalByIdService {
  constructor(
    @inject(ioc.repositories.authRepository)
    private journalRepository: IJournalRepository,
  ) {}

  async execute({ id }: FindJournalByIdDTO): Promise<Journal> {
    const journal = await this.journalRepository.findById(id);

    if (!journal) {
      throw new CustomError({
        message: 'Diário de trade não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return journal;
  }
}
