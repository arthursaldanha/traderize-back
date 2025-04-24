import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { TradeAccount, type User } from '@/core/entities';
import { ITradeAccountRepository } from '@/repositories/account/ITradeAccountRepository';

import { PlanService } from '@/modules/subscription-plans/application/services';
import { CreateTradeAccountDTO } from '@/modules/account/application/DTOs';
import { Feature } from '@/modules/subscription-plans/domain/enums/feature';

@injectable()
export class CreateTradeAccountService {
  constructor(
    @inject(ioc.repositories.tradeAccountRepository)
    private tradeAccountRepository: ITradeAccountRepository,
  ) {}

  async execute({
    user,
    market,
    currency,
    platform,
    isPropFirm,
    broker,
    initialBalance,
    currentBalance,
  }: CreateTradeAccountDTO & { user: User }): Promise<TradeAccount> {
    const isAllowedAccessThisService = PlanService.canAccess(
      user,
      Feature.TRADE_ACCOUNTS,
    );

    if (!isAllowedAccessThisService) {
      throw new CustomError({
        message: 'Você não tem permissão para acessar esse serviço.',
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const userId = user.id.getValue();

    const existingAccounts =
      await this.tradeAccountRepository.listByUserId(userId);

    const tradeAccountRules = PlanService.getFeatureRules(
      user,
      Feature.TRADE_ACCOUNTS,
    );

    const limitToCreateAccounts =
      'limit' in tradeAccountRules ? tradeAccountRules.limit : null;

    if (
      limitToCreateAccounts !== null &&
      existingAccounts.length >= limitToCreateAccounts
    ) {
      throw new CustomError({
        message: `Você atingiu o limite de ${limitToCreateAccounts} contas para o seu plano.`,
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const tradeAccount = TradeAccount.create({
      userId,
      market,
      currency,
      platform,
      isPropFirm,
      broker,
      initialBalance,
      currentBalance,
    });

    await this.tradeAccountRepository.save(tradeAccount);

    return tradeAccount;
  }
}
