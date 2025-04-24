import {
  PrismaClient,
  type Market,
  type Platform,
  type TradeAccountCurrency,
} from '@prisma/client';

import { TradeAccount } from '@/core/entities/TradeAccount';
import { ITradeAccountRepository } from '@/repositories/account/ITradeAccountRepository';

const prisma = new PrismaClient();

export class SqlTradeAccountRepository implements ITradeAccountRepository {
  async save(tradeAccount: TradeAccount): Promise<void> {
    await prisma.account.create({
      data: {
        id: tradeAccount.id.getValue(),
        userId: tradeAccount.userId.getValue(),
        market: tradeAccount.market.map((m) => m as Market),
        currency: tradeAccount.currency as TradeAccountCurrency,
        platform: tradeAccount.platform as Platform,
        isPropFirm: tradeAccount.isPropFirm,
        broker: tradeAccount.broker,
        initialBalance: tradeAccount.getInitialBalance(),
        currentBalance: tradeAccount.getCurrentBalance(),
        floatingBalance: tradeAccount.getFloatingBalance(),
        createdAt: tradeAccount.createdAt,
        updatedAt: tradeAccount.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<TradeAccount | null> {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) return null;

    return TradeAccount.restore({
      id: account.id,
      userId: account.userId,
      market: account.market.map((m) => m as string),
      currency: account.currency as string,
      platform: account.platform as string,
      isPropFirm: account.isPropFirm,
      broker: account.broker,
      initialBalance: Number(account.initialBalance),
      currentBalance: Number(account.currentBalance),
      floatingBalance: Number(account.floatingBalance),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async listByUserId(userId: string): Promise<TradeAccount[]> {
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    return accounts.map((account) =>
      TradeAccount.restore({
        id: account.id,
        userId: account.userId,
        market: account.market.map((m) => m as string),
        currency: account.currency as string,
        platform: account.platform as string,
        isPropFirm: account.isPropFirm,
        broker: account.broker,
        initialBalance: Number(account.initialBalance),
        currentBalance: Number(account.currentBalance),
        floatingBalance: Number(account.floatingBalance),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }),
    );
  }
}
