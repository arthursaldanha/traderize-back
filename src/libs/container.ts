import { Container } from 'inversify';

import { ioc } from '@/ioc';

import { IAuthRepository, SqlAuthRepository } from '@/repositories/auth';
import {
  IAccountRepository,
  SqlAccountRepository,
} from '@/repositories/account';
import { IUserRepository, SqlUserRepository } from '@/repositories/user';
import {
  ISubscriptionPlanRepository,
  SqlSubscriptionPlanRepository,
} from '@/repositories/subscription-plans';
import {
  IJournalRepository,
  SqlJournalRepository,
} from '@/repositories/journal';
import {
  IJournalDetailMT5Repository,
  SqlJournalDetailMT5Repository,
} from '@/repositories/journal-detail-mt5';
import {
  IStrategyRepository,
  SqlStrategyRepository,
} from '@/repositories/strategy';

const container = new Container();

// Bindings - AUTH REPOSITORY
container
  .bind<IAuthRepository>(ioc.repositories.authRepository)
  .to(SqlAuthRepository);

// Bindings - USER REPOSITORY
container
  .bind<IUserRepository>(ioc.repositories.userRepository)
  .to(SqlUserRepository);

// Bindings - SUBSCRIPTION PLANS REPOSITORY
container
  .bind<ISubscriptionPlanRepository>(ioc.repositories.subscriptionPlan)
  .to(SqlSubscriptionPlanRepository);

// Bindings - ACCOUNT REPOSITORY
container
  .bind<IAccountRepository>(ioc.repositories.accountRepository)
  .to(SqlAccountRepository);

// Bindings - JOURNAL REPOSITORY
container
  .bind<IJournalRepository>(ioc.repositories.journalRepository)
  .to(SqlJournalRepository);

// Bindings - JOURNAL DETAIL MT5 REPOSITORY
container
  .bind<IJournalDetailMT5Repository>(
    ioc.repositories.journalDetailMt5Repository,
  )
  .to(SqlJournalDetailMT5Repository);

// Bindings - STRATEGY REPOSITORY
container
  .bind<IStrategyRepository>(ioc.repositories.strategyRepository)
  .to(SqlStrategyRepository);

export { container };
