import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { Journal, type User } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';
import { IJournalRepository } from '@/repositories/journal';
import type { DashboardAnalyticsDTO } from '../DTOs';

@injectable()
export class AnalyzeDashboardDataUseCase {
  execute(journals: Journal[]) {
    // TODO: Implementar lógica de agrupamento, análise e cálculo
    // Aqui você implementará toda a lógica de:
    // - Agrupamento dos journals
    // - Cálculos de métricas
    // - Análises dos dados
    // - Formatação dos resultados

    return {
      // Placeholder para estrutura de retorno
      totalTrades: journals.length,
      // ... outras métricas calculadas
    };
  }
}

@injectable()
export class GetDashboardAnalyticsService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,

    @inject(ioc.repositories.journalRepository)
    private journalRepository: IJournalRepository,

    @inject(ioc.useCases.analyzeDashboardDataUseCase)
    private analyzeDashboardDataUseCase: AnalyzeDashboardDataUseCase,
  ) {}

  async execute({ data }: { data: DashboardAnalyticsDTO & { user: User } }) {
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

    const analyticsResult = this.analyzeDashboardDataUseCase.execute(journals);

    return {
      success: true,
      data: analyticsResult,
      metadata: {
        accountsAnalyzed: accountIdsToAnalyze.length,
        totalJournals: journals.length,
      },
    };
  }
}
