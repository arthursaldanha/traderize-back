export const ioc = {
  repositories: {
    authRepository: Symbol.for('AuthRepository'),
    userRepository: Symbol.for('UserRepository'),
    subscriptionPlan: Symbol.for('SubscriptionPlan'),
    accountRepository: Symbol.for('AccountRepository'),
    journalRepository: Symbol.for('JournalRepository'),
    journalDetailMt5Repository: Symbol.for('JournalDetailMt5Repository'),
    strategyRepository: Symbol.for('StrategyRepository'),
  },
};
