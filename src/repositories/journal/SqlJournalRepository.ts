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
    await prisma.journal.create({
      data: {
        id: journal.id.getValue(),
        accountId: journal.accountId.getValue(),
        strategyId: journal.getStrategyId()?.getValue(),
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
      },
    });
  }

  async createMany(journals: Journal[]): Promise<void> {
    if (!journals.length) return;

    const filtered = journals.filter((deal) => deal);

    const plainJournals = filtered.map((j) => ({
      id: j.id.getValue(),
      accountId: j.accountId.getValue(),
      strategyId: j.getStrategyId?.() ? j.getStrategyId()?.getValue() : null,
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
    }));

    await prisma.journal.createMany({
      data: plainJournals,
      skipDuplicates: true,
    });
  }

  async findById(id: string, withDetails = false): Promise<Journal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: { id },
      include: {
        strategy: true,
        detailsMetaTrader5: withDetails,
      },
    });

    if (!tradeJournal) return null;

    const journal = Journal.restore({
      id: tradeJournal.id,
      accountId: tradeJournal.accountId,
      strategyId: tradeJournal.strategyId,
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
    });

    if (tradeJournal.strategy) {
      journal.setStrategy(Strategy.restore(tradeJournal.strategy));
    }
    if (withDetails) {
      journal.setJournalDetailMt5(
        tradeJournal.detailsMetaTrader5.map(JournalDetailMT5.restore),
      );
    }

    return journal;
  }

  async findByExternalTradeId({
    accountId,
    externalTradeId,
    withStrategy,
    withDetails,
  }: {
    accountId: string;
    externalTradeId: string;
    withStrategy?: false;
    withDetails?: false;
  }): Promise<Journal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: {
        accountId_externalTradeId: {
          accountId,
          externalTradeId,
        },
      },
      include: {
        strategy: withStrategy,
        detailsMetaTrader5: withDetails,
      },
    });

    if (!tradeJournal) return null;

    const journal = Journal.restore({
      id: tradeJournal.id,
      accountId: tradeJournal.accountId,
      strategyId: tradeJournal.strategyId,
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
    });

    // if (tradeJournal.strategy) {
    //   journal.setStrategy(Strategy.restore(tradeJournal.strategy));
    // }
    // if (withDetails) {
    //   journal.setJournalDetailMt5(
    //     tradeJournal.detailsMetaTrader5.map(JournalDetailMT5.restore),
    //   );
    // }

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
        detailsMetaTrader5: true,
      },
    });

    if (!journals.length) return null;

    const formatedJournals = journals.map((j) => {
      const journal = Journal.restore({
        id: j.id,
        accountId: j.accountId,
        strategyId: j.strategyId,
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
      });

      if (j.detailsMetaTrader5.length) {
        journal.setJournalDetailMt5(
          j.detailsMetaTrader5.map(JournalDetailMT5.restore),
        );
      }

      return journal;
    });

    return formatedJournals;
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
        strategy: details.withStrategy,
        detailsMetaTrader5: details.withMt5Transactions,
      },
    });

    return tradeJournals.map((journal) => {
      const entity = Journal.restore({
        id: journal.id,
        accountId: journal.accountId,
        strategyId: journal.strategyId,
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
      });

      if (journal.strategy) {
        entity.setStrategy(Strategy.restore(journal.strategy));
      }
      if (journal.detailsMetaTrader5.length) {
        entity.setJournalDetailMt5(
          journal.detailsMetaTrader5.map(JournalDetailMT5.restore),
        );
      }

      return entity;
    });
  }

  async update(journal: Journal): Promise<void> {
    await prisma.journal.update({
      where: { id: journal.id.getValue() },
      data: {
        id: journal.id.getValue(),
        accountId: journal.accountId.getValue(),
        strategyId: journal.getStrategyId()?.getValue(),
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
      },
    });
  }

  async updateMany(journals: Journal[]): Promise<void> {
    await prisma.$transaction(
      journals.map((j) =>
        prisma.journal.update({
          where: { id: j.id.getValue() },
          data: {
            id: j.id.getValue(),
            accountId: j.accountId.getValue(),
            strategyId: j.getStrategyId()?.getValue(),
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
          },
        }),
      ),
    );
  }
}
