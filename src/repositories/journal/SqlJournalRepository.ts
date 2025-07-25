import { PrismaClient, Status, Direction } from '@prisma/client';

import { IJournalRepository } from '@/repositories/journal';
import { Journal, Strategy, JournalDetailMT5 } from '@/core/entities';

const prisma = new PrismaClient();

export class SqlJournalRepository implements IJournalRepository {
  async create(tradeJournal: Journal): Promise<void> {
    await prisma.journal.create({
      data: {
        id: tradeJournal.id.getValue(),
        accountId: tradeJournal.accountId.getValue(),
        strategyId: tradeJournal.getStrategyId()?.getValue(),
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
        status: tradeJournal.status as Status,
        direction: tradeJournal.direction as Direction,
        timeDateStart: tradeJournal.timeDateStart,
        timeDateEnd: tradeJournal.timeDateEnd,
        tradeDuration: tradeJournal.tradeDuration,
        notes: tradeJournal.notes,
        createdAt: tradeJournal.createdAt,
        updatedAt: tradeJournal.updatedAt,
      },
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

  async findByExternalTradeId(
    externalTradeId: string,
    accountId: string,
    withDetails = false,
  ): Promise<Journal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: {
        accountId_externalTradeId: {
          accountId,
          externalTradeId,
        },
      },
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

  async listByAccountId(
    accountId: string,
    withDetails = false,
  ): Promise<Journal[]> {
    const tradeJournals = await prisma.journal.findMany({
      where: { accountId },
      include: {
        strategy: true,
        detailsMetaTrader5: withDetails,
      },
    });

    return tradeJournals.map((journal) => {
      const entity = Journal.restore({
        id: journal.id,
        accountId: journal.accountId,
        strategyId: journal.strategyId,
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
      if (withDetails) {
        entity.setJournalDetailMt5(
          journal.detailsMetaTrader5.map(JournalDetailMT5.restore),
        );
      }

      return entity;
    });
  }

  async update(tradeJournal: Journal): Promise<void> {
    await prisma.journal.update({
      where: { id: tradeJournal.id.getValue() },
      data: {
        id: tradeJournal.id.getValue(),
        accountId: tradeJournal.accountId.getValue(),
        strategyId: tradeJournal.getStrategyId()?.getValue(),
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
        status: tradeJournal.status as Status,
        direction: tradeJournal.direction as Direction,
        timeDateStart: tradeJournal.timeDateStart,
        timeDateEnd: tradeJournal.timeDateEnd,
        tradeDuration: tradeJournal.tradeDuration,
        notes: tradeJournal.notes,
        createdAt: tradeJournal.createdAt,
        updatedAt: tradeJournal.updatedAt,
      },
    });
  }
}
