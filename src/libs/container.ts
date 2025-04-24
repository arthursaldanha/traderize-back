import { Container } from 'inversify';

import { ioc } from '@/ioc';

import { IAuthRepository, SqlAuthRepository } from '@/repositories/auth';
import {
  ITradeAccountRepository,
  SqlTradeAccountRepository,
} from '@/repositories/account';
import { IUserRepository, SqlUserRepository } from '@/repositories/user';
import {
  ISubscriptionPlanRepository,
  SqlSubscriptionPlanRepository,
} from '@/repositories/subscription-plans';
import {
  ITradeJournalRepository,
  SqlTradeJournalRepository,
} from '@/repositories/journal';
import {
  ITradeStrategyRepository,
  SqlTradeStrategyRepository,
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

// Bindings - TRADE ACCOUNT REPOSITORY
container
  .bind<ITradeAccountRepository>(ioc.repositories.tradeAccountRepository)
  .to(SqlTradeAccountRepository);

// Bindings - TRADE JOURNAL REPOSITORY
container
  .bind<ITradeJournalRepository>(ioc.repositories.tradeJournalRepository)
  .to(SqlTradeJournalRepository);

// Bindings - TRADE STRATEGY REPOSITORY
container
  .bind<ITradeStrategyRepository>(ioc.repositories.tradeStrategyRepository)
  .to(SqlTradeStrategyRepository);

export { container };
