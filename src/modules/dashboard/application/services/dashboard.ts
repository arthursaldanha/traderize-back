import { inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import type { User } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';
import { IJournalRepository } from '@/repositories/journal';
import type { DashboardAnalyticsDTO } from '@/modules/dashboard/application/DTOs';
import type { AnalyzeDashboardDataUseCase } from '@/modules/dashboard/application/useCases/analyze-dashboard';

export class GetDashboardAnalyticsService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,

    @inject(ioc.repositories.journalRepository)
    private journalRepository: IJournalRepository,

    @inject(ioc.useCases.analyzeDashboardDataUseCase)
    private analyzeDashboardDataUseCase: AnalyzeDashboardDataUseCase,
  ) {}

  async execute(data: DashboardAnalyticsDTO & { user: User }) {
    const userAccounts = await this.accountRepository.listByUserId(
      data.user.id.getValue(),
    );

    if (!userAccounts.length) {
      throw new CustomError({
        message: 'Nenhuma conta encontrada para este usuário.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    let accountIdsToAnalyze: string[];

    if (!data.accountIds || data.accountIds.length === 0) {
      accountIdsToAnalyze = userAccounts.map((account) =>
        account.id.getValue(),
      );
    } else {
      const userAccountIds = new Set(
        userAccounts.map((account) => account.id.getValue()),
      );

      accountIdsToAnalyze = data.accountIds.filter((accountId) =>
        userAccountIds.has(accountId),
      );

      if (accountIdsToAnalyze.length === 0) {
        throw new CustomError({
          message: 'Nenhuma conta válida encontrada nos IDs fornecidos.',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }
    }

    const journals = await this.journalRepository.listByAccountIds({
      accountIds: accountIdsToAnalyze,
      details: { withMt5Transactions: true },
    });

    const analyticsResult = this.analyzeDashboardDataUseCase.execute(
      journals,
      accountIdsToAnalyze.length,
    );

    return {
      success: true,
      data: analyticsResult,
      metadata: {
        accountsAnalyzed: accountIdsToAnalyze.length,
        totalJournals: journals.length,
        closedTrades: journals.filter((j) => j.status === 'CLOSED').length,
        openTrades: journals.filter((j) => j.status === 'OPEN').length,
      },
    };
  }
}
