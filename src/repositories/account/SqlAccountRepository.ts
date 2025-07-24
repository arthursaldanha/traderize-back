import {
  PrismaClient,
  type Market,
  type Platform,
  type AccountCurrency,
} from '@prisma/client';

import { Account } from '@/core/entities/Account';
import { IAccountRepository } from '@/repositories/account';

const prisma = new PrismaClient();

export class SqlAccountRepository implements IAccountRepository {
  async save(tradeAccount: Account): Promise<void> {
    await prisma.account.create({
      data: {
        id: tradeAccount.id.getValue(),
        userId: tradeAccount.userId.getValue(),
        market: tradeAccount.market.map((m) => m as Market),
        currency: tradeAccount.currency as AccountCurrency,
        platform: tradeAccount.platform as Platform,
        isPropFirm: tradeAccount.isPropFirm,
        broker: tradeAccount.broker,
        externalId: tradeAccount.externalId,
        description: tradeAccount.description,
        initialBalance: tradeAccount.getInitialBalance(),
        currentBalance: tradeAccount.getCurrentBalance(),
        floatingBalance: tradeAccount.getFloatingBalance(),
        credits: tradeAccount.getCreditsBalance(),
        disabled: tradeAccount.disabled,
        createdAt: tradeAccount.createdAt,
        updatedAt: tradeAccount.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) return null;

    return Account.restore({
      id: account.id,
      userId: account.userId,
      market: account.market.map((m) => m as string),
      currency: account.currency as string,
      platform: account.platform as string,
      isPropFirm: account.isPropFirm,
      broker: account.broker,
      externalId: account.externalId,
      description: account.description,
      initialBalance: Number(account.initialBalance),
      currentBalance: Number(account.currentBalance),
      floatingBalance: Number(account.floatingBalance),
      credits: Number(account.credits),
      disabled: account.disabled,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async listByUserId(userId: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    return accounts.map((account) =>
      Account.restore({
        id: account.id,
        userId: account.userId,
        market: account.market.map((m) => m as string),
        currency: account.currency as string,
        platform: account.platform as string,
        isPropFirm: account.isPropFirm,
        broker: account.broker,
        externalId: account.externalId,
        description: account.description,
        initialBalance: Number(account.initialBalance),
        currentBalance: Number(account.currentBalance),
        floatingBalance: Number(account.floatingBalance),
        credits: Number(account.credits),
        disabled: account.disabled,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }),
    );
  }
}
