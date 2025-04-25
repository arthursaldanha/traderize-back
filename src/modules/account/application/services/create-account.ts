import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { Account, type User } from '@/core/entities';
import { IAccountRepository } from '@/repositories/account';

import { PlanService } from '@/modules/subscription-plans/application/services';
import { CreateAccountDTO } from '@/modules/account/application/DTOs';
import { Feature } from '@/modules/subscription-plans/domain/enums/feature';

@injectable()
export class CreateAccountService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,
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
    credits,
    disabled,
  }: CreateAccountDTO & { user: User }): Promise<Account> {
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

    const existingAccounts = await this.accountRepository.listByUserId(userId);

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

    const tradeAccount = Account.create({
      userId,
      market,
      currency,
      platform,
      isPropFirm,
      broker,
      initialBalance,
      currentBalance,
      floatingBalance: currentBalance,
      credits,
      disabled,
    });

    await this.accountRepository.save(tradeAccount);

    return tradeAccount;
  }
}
