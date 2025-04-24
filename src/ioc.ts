export const ioc = {
  repositories: {
    authRepository: Symbol.for('AuthRepository'),
    userRepository: Symbol.for('UserRepository'),
    subscriptionPlan: Symbol.for('SubscriptionPlan'),
    tradeAccountRepository: Symbol.for('TradeAccountRepository'),
    tradeJournalRepository: Symbol.for('TradeJournalRepository'),
    tradeStrategyRepository: Symbol.for('TradeStrategyRepository'),
  },
};
