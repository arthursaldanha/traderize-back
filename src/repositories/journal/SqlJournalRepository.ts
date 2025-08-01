import {
  PrismaClient,
  Status,
  Direction,
  type CreationMethod,
} from '@prisma/client';

import { IJournalRepository } from '@/repositories/journal';
import { Journal, Strategy, JournalDetailMT5 } from '@/core/entities';

const prisma = new PrismaClient();

export class SqlJournalRepository implements IJournalRepository {
  async create(journal: Journal): Promise<void> {
    // Criação do Journal e ligação das estratégias
    await prisma.journal.create({
      data: {
        id: journal.id.getValue(),
        accountId: journal.accountId.getValue(),
        creationMethod: journal.creationMethod as CreationMethod,
        externalTradeId: journal.externalTradeId,
        symbol: journal.symbol,
        entryPrice: journal.entryPrice,
        stopPrice: journal.stopPrice,
        takePrices: journal.takePrices,
        investment: journal.investment,
        lots: journal.lots,
        result: journal.result,
        commission: journal.commission,
        swap: journal.swap,
        fee: journal.fee,
        total: journal.total,
        riskRewardRatio: journal.riskRewardRatio,
        imageUrls: journal.imageUrls,
        status: journal.status as Status,
        direction: journal.direction as Direction,
        timeDateStart: journal.timeDateStart,
        timeDateEnd: journal.timeDateEnd,
        tradeDuration: journal.tradeDuration,
        notes: journal.notes,
        createdAt: journal.createdAt,
        updatedAt: journal.updatedAt,
        // Vincula as estratégias via connect (N:N)
        strategies: {
          connect:
            journal.strategies?.map((s) => ({ id: s.id.getValue() })) ?? [],
        },
      },
    });
  }

  async createMany(journals: Journal[]): Promise<void> {
    if (!journals.length) return;

    // Como não é possível criar relacionamentos N:N no createMany do Prisma,
    // crie os journals e depois relacione as strategies manualmente
    await prisma.$transaction(
      journals.map((journal) =>
        prisma.journal.create({
          data: {
            id: journal.id.getValue(),
            accountId: journal.accountId.getValue(),
            creationMethod: journal.creationMethod as CreationMethod,
            externalTradeId: journal.externalTradeId,
            symbol: journal.symbol,
            entryPrice: journal.entryPrice,
            stopPrice: journal.stopPrice,
            takePrices: journal.takePrices,
            investment: journal.investment,
            lots: journal.lots,
            result: journal.result,
            commission: journal.commission,
            swap: journal.swap,
            fee: journal.fee,
            total: journal.total,
            riskRewardRatio: journal.riskRewardRatio,
            imageUrls: journal.imageUrls,
            status: journal.status as Status,
            direction: journal.direction as Direction,
            timeDateStart: journal.timeDateStart,
            timeDateEnd: journal.timeDateEnd,
            tradeDuration: journal.tradeDuration,
            notes: journal.notes,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt,
            strategies: {
              connect:
                journal.strategies?.map((s) => ({ id: s.id.getValue() })) ?? [],
            },
          },
        }),
      ),
    );
  }

  async findById(id: string, withDetails = false): Promise<Journal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: { id },
      include: {
        strategies: true,
        detailsMetaTrader5: withDetails,
      },
    });

    if (!tradeJournal) return null;

    const journal = Journal.restore({
      id: tradeJournal.id,
      accountId: tradeJournal.accountId,
      creationMethod: tradeJournal.creationMethod,
      externalTradeId: tradeJournal.externalTradeId,
      symbol: tradeJournal.symbol,
      entryPrice: tradeJournal.entryPrice,
      stopPrice: tradeJournal.stopPrice,
      takePrices: tradeJournal.takePrices,
      investment: tradeJournal.investment,
      lots: tradeJournal.lots,
      result: tradeJournal.result,
      commission: tradeJournal.commission,
      swap: tradeJournal.swap,
      fee: tradeJournal.fee,
      total: tradeJournal.total,
      riskRewardRatio: tradeJournal.riskRewardRatio,
      imageUrls: tradeJournal.imageUrls,
      status: tradeJournal.status,
      direction: tradeJournal.direction,
      timeDateStart: tradeJournal.timeDateStart,
      timeDateEnd: tradeJournal.timeDateEnd,
      tradeDuration: tradeJournal.tradeDuration,
      notes: tradeJournal.notes,
      createdAt: tradeJournal.createdAt,
      updatedAt: tradeJournal.updatedAt,
      strategies: tradeJournal.strategies?.map(Strategy.restore) ?? [],
      detailsMetaTrader5: withDetails
        ? tradeJournal.detailsMetaTrader5.map(JournalDetailMT5.restore)
        : [],
    });

    return journal;
  }

  async findByExternalTradeId({
    accountId,
    externalTradeId,
    details = { withStrategy: false, withMt5Transactions: false },
  }: {
    accountId: string;
    externalTradeId: string;
    details: { withStrategy?: boolean; withMt5Transactions?: boolean };
  }): Promise<Journal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: {
        accountId_externalTradeId: {
          accountId,
          externalTradeId,
        },
      },
      include: {
        strategies: details.withStrategy,
        detailsMetaTrader5: details.withMt5Transactions,
      },
    });

    if (!tradeJournal) return null;

    const journal = Journal.restore({
      id: tradeJournal.id,
      accountId: tradeJournal.accountId,
      creationMethod: tradeJournal.creationMethod,
      externalTradeId: tradeJournal.externalTradeId,
      symbol: tradeJournal.symbol,
      entryPrice: tradeJournal.entryPrice,
      stopPrice: tradeJournal.stopPrice,
      takePrices: tradeJournal.takePrices,
      investment: tradeJournal.investment,
      lots: tradeJournal.lots,
      result: tradeJournal.result,
      commission: tradeJournal.commission,
      swap: tradeJournal.swap,
      fee: tradeJournal.fee,
      total: tradeJournal.total,
      riskRewardRatio: tradeJournal.riskRewardRatio,
      imageUrls: tradeJournal.imageUrls,
      status: tradeJournal.status,
      direction: tradeJournal.direction,
      timeDateStart: tradeJournal.timeDateStart,
      timeDateEnd: tradeJournal.timeDateEnd,
      tradeDuration: tradeJournal.tradeDuration,
      notes: tradeJournal.notes,
      createdAt: tradeJournal.createdAt,
      updatedAt: tradeJournal.updatedAt,
      strategies: details.withStrategy
        ? tradeJournal.strategies.map(Strategy.restore)
        : [],
      detailsMetaTrader5: details.withMt5Transactions
        ? tradeJournal.detailsMetaTrader5.map(JournalDetailMT5.restore)
        : [],
    });

    return journal;
  }

  async listByAccountIdAndExternalTradeIds({
    accountId,
    externalTradeIds,
  }: {
    accountId: string;
    externalTradeIds: string[];
  }): Promise<Journal[] | null> {
    const journals = await prisma.journal.findMany({
      where: {
        accountId,
        externalTradeId: { in: externalTradeIds },
      },
      include: {
        strategies: true,
        detailsMetaTrader5: true,
      },
    });

    if (!journals.length) return null;

    return journals.map((j) =>
      Journal.restore({
        id: j.id,
        accountId: j.accountId,
        creationMethod: j.creationMethod,
        externalTradeId: j.externalTradeId,
        symbol: j.symbol,
        entryPrice: j.entryPrice,
        stopPrice: j.stopPrice,
        takePrices: j.takePrices,
        investment: j.investment,
        lots: j.lots,
        result: j.result,
        commission: j.commission,
        swap: j.swap,
        fee: j.fee,
        total: j.total,
        riskRewardRatio: j.riskRewardRatio,
        imageUrls: j.imageUrls,
        status: j.status,
        direction: j.direction,
        timeDateStart: j.timeDateStart,
        timeDateEnd: j.timeDateEnd,
        tradeDuration: j.tradeDuration,
        notes: j.notes,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
        strategies: j.strategies?.map(Strategy.restore) ?? [],
        detailsMetaTrader5:
          j.detailsMetaTrader5?.map(JournalDetailMT5.restore) ?? [],
      }),
    );
  }

  async listByAccountIds({
    accountIds,
    details = { withStrategy: false, withMt5Transactions: false },
  }: {
    accountIds: string[];
    details: { withStrategy?: boolean; withMt5Transactions?: boolean };
  }): Promise<Journal[]> {
    const tradeJournals = await prisma.journal.findMany({
      where: { accountId: { in: accountIds } },
      include: {
        strategies: details.withStrategy,
        detailsMetaTrader5: details.withMt5Transactions,
      },
    });

    return tradeJournals.map((journal) =>
      Journal.restore({
        id: journal.id,
        accountId: journal.accountId,
        creationMethod: journal.creationMethod,
        externalTradeId: journal.externalTradeId,
        symbol: journal.symbol,
        entryPrice: journal.entryPrice,
        stopPrice: journal.stopPrice,
        takePrices: journal.takePrices,
        investment: journal.investment,
        lots: journal.lots,
        result: journal.result,
        commission: journal.commission,
        swap: journal.swap,
        fee: journal.fee,
        total: journal.total,
        riskRewardRatio: journal.riskRewardRatio,
        imageUrls: journal.imageUrls,
        status: journal.status,
        direction: journal.direction,
        timeDateStart: journal.timeDateStart,
        timeDateEnd: journal.timeDateEnd,
        tradeDuration: journal.tradeDuration,
        notes: journal.notes,
        createdAt: journal.createdAt,
        updatedAt: journal.updatedAt,
        strategies: details.withStrategy
          ? journal.strategies.map(Strategy.restore)
          : [],
        detailsMetaTrader5: details.withMt5Transactions
          ? journal.detailsMetaTrader5.map(JournalDetailMT5.restore)
          : [],
      }),
    );
  }

  async update(journal: Journal): Promise<void> {
    await prisma.journal.update({
      where: { id: journal.id.getValue() },
      data: {
        accountId: journal.accountId.getValue(),
        creationMethod: journal.creationMethod as CreationMethod,
        externalTradeId: journal.externalTradeId,
        symbol: journal.symbol,
        entryPrice: journal.entryPrice,
        stopPrice: journal.stopPrice,
        takePrices: journal.takePrices,
        investment: journal.investment,
        lots: journal.lots,
        result: journal.result,
        commission: journal.commission,
        swap: journal.swap,
        fee: journal.fee,
        total: journal.total,
        riskRewardRatio: journal.riskRewardRatio,
        imageUrls: journal.imageUrls,
        status: journal.status as Status,
        direction: journal.direction as Direction,
        timeDateStart: journal.timeDateStart,
        timeDateEnd: journal.timeDateEnd,
        tradeDuration: journal.tradeDuration,
        notes: journal.notes,
        createdAt: journal.createdAt,
        updatedAt: journal.updatedAt,
        strategies: {
          set: journal.strategies?.map((s) => ({ id: s.id.getValue() })) ?? [],
        },
      },
    });
  }

  async updateMany(journals: Journal[]): Promise<void> {
    await prisma.$transaction(
      journals.map((j) =>
        prisma.journal.update({
          where: { id: j.id.getValue() },
          data: {
            accountId: j.accountId.getValue(),
            creationMethod: j.creationMethod as CreationMethod,
            externalTradeId: j.externalTradeId,
            symbol: j.symbol,
            entryPrice: j.entryPrice,
            stopPrice: j.stopPrice,
            takePrices: j.takePrices,
            investment: j.investment,
            lots: j.lots,
            result: j.result,
            commission: j.commission,
            swap: j.swap,
            fee: j.fee,
            total: j.total,
            riskRewardRatio: j.riskRewardRatio,
            imageUrls: j.imageUrls,
            status: j.status as Status,
            direction: j.direction as Direction,
            timeDateStart: j.timeDateStart,
            timeDateEnd: j.timeDateEnd,
            tradeDuration: j.tradeDuration,
            notes: j.notes,
            createdAt: j.createdAt,
            updatedAt: j.updatedAt,
            strategies: {
              set: j.strategies?.map((s) => ({ id: s.id.getValue() })) ?? [],
            },
          },
        }),
      ),
    );
  }
}
