import { PrismaClient, TradeStatus, TradeDirection } from '@prisma/client';

import {
  TradeJournal,
  TradeStrategy,
  TradeJournalComment,
} from '@/core/entities';
import { ITradeJournalRepository } from '@/repositories/journal/ITradeJournalRepository';

const prisma = new PrismaClient();

export class SqlTradeJournalRepository implements ITradeJournalRepository {
  async create(tradeJournal: TradeJournal): Promise<void> {
    await prisma.journal.create({
      data: {
        id: tradeJournal.id.getValue(),
        accountId: tradeJournal.accountId.getValue(),
        strategyId: tradeJournal.getStrategyId()?.getValue(),
        asset: tradeJournal.asset,
        entryPrice: tradeJournal.entryPrice,
        stopPrice: tradeJournal.stopPrice,
        takePrices: tradeJournal.takePrices,
        investment: tradeJournal.investment,
        lots: tradeJournal.lots,
        result: tradeJournal.result,
        riskRewardRatio: tradeJournal.riskRewardRatio,
        imageUrls: tradeJournal.imageUrls,
        status: tradeJournal.status as TradeStatus,
        direction: tradeJournal.direction as TradeDirection,
        tradeDate: tradeJournal.tradeDate,
        notes: tradeJournal.notes,
        createdAt: tradeJournal.createdAt,
        updatedAt: tradeJournal.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<TradeJournal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: { id },
      include: { strategy: true },
    });

    if (!tradeJournal) return null;

    const restoredTradeJournal = TradeJournal.restore({
      id: tradeJournal.id,
      accountId: tradeJournal.accountId,
      strategyId: tradeJournal.strategyId,
      asset: tradeJournal.asset,
      entryPrice: Number(tradeJournal.entryPrice),
      stopPrice: Number(tradeJournal.stopPrice),
      takePrices: tradeJournal.takePrices.map((price) => Number(price)),
      investment: Number(tradeJournal.investment),
      lots: Number(tradeJournal.lots),
      result: Number(tradeJournal.result),
      riskRewardRatio: Number(tradeJournal.riskRewardRatio),
      status: tradeJournal.status,
      imageUrls: tradeJournal.imageUrls,
      direction: tradeJournal.direction,
      tradeDate: tradeJournal.tradeDate,
      notes: tradeJournal.notes,
      createdAt: tradeJournal.createdAt,
      updatedAt: tradeJournal.updatedAt,
    });

    if (tradeJournal.strategy) {
      const strategy = TradeStrategy.restore(tradeJournal.strategy);
      restoredTradeJournal.setStrategy(strategy);
    }

    return restoredTradeJournal;
  }

  async findByIdWithComments(id: string): Promise<TradeJournal | null> {
    const tradeJournal = await prisma.journal.findUnique({
      where: { id },
      include: { strategy: true, tradeJournalComment: true },
    });

    if (!tradeJournal) return null;

    const restoredTradeJournal = TradeJournal.restore({
      id: tradeJournal.id,
      accountId: tradeJournal.accountId,
      strategyId: tradeJournal.strategyId,
      asset: tradeJournal.asset,
      entryPrice: Number(tradeJournal.entryPrice),
      stopPrice: Number(tradeJournal.stopPrice),
      takePrices: tradeJournal.takePrices.map((price) => Number(price)),
      investment: Number(tradeJournal.investment),
      lots: Number(tradeJournal.lots),
      result: Number(tradeJournal.result),
      riskRewardRatio: Number(tradeJournal.riskRewardRatio),
      status: tradeJournal.status,
      imageUrls: tradeJournal.imageUrls,
      direction: tradeJournal.direction,
      tradeDate: tradeJournal.tradeDate,
      notes: tradeJournal.notes,
      createdAt: tradeJournal.createdAt,
      updatedAt: tradeJournal.updatedAt,
    });

    if (tradeJournal.strategy) {
      const strategy = TradeStrategy.restore(tradeJournal.strategy);
      restoredTradeJournal.setStrategy(strategy);
    }

    if (tradeJournal.tradeJournalComment.length > 0) {
      const comments = tradeJournal.tradeJournalComment.map(
        TradeJournalComment.restore,
      );
      restoredTradeJournal.setComments(comments);
    }

    return restoredTradeJournal;
  }

  async listByAccountId(accountId: string): Promise<TradeJournal[]> {
    const tradeJournals = await prisma.journal.findMany({
      where: { accountId },
      include: { strategy: true },
    });

    return tradeJournals.map((journal) => {
      const restoredJournal = TradeJournal.restore({
        id: journal.id,
        accountId: journal.accountId,
        strategyId: journal.strategyId,
        asset: journal.asset,
        entryPrice: Number(journal.entryPrice),
        stopPrice: Number(journal.stopPrice),
        takePrices: journal.takePrices.map((price) => Number(price)),
        investment: Number(journal.investment),
        lots: Number(journal.lots),
        result: Number(journal.result),
        riskRewardRatio: Number(journal.riskRewardRatio),
        status: journal.status,
        imageUrls: journal.imageUrls,
        direction: journal.direction,
        tradeDate: journal.tradeDate,
        notes: journal.notes,
        createdAt: journal.createdAt,
        updatedAt: journal.updatedAt,
      });

      if (journal.strategy) {
        const strategy = TradeStrategy.restore(journal.strategy);
        restoredJournal.setStrategy(strategy);
      }

      return restoredJournal;
    });
  }

  async update(tradeJournal: TradeJournal): Promise<void> {
    await prisma.journal.update({
      where: { id: tradeJournal.id.getValue() },
      data: {
        id: tradeJournal.id.getValue(),
        accountId: tradeJournal.accountId.getValue(),
        strategyId: tradeJournal.getStrategyId()?.getValue(),
        asset: tradeJournal.asset,
        entryPrice: tradeJournal.entryPrice,
        stopPrice: tradeJournal.stopPrice,
        takePrices: tradeJournal.takePrices,
        investment: Number(tradeJournal.investment),
        lots: Number(tradeJournal.lots),
        result: tradeJournal.result,
        riskRewardRatio: tradeJournal.riskRewardRatio,
        status: tradeJournal.status as TradeStatus,
        direction: tradeJournal.direction as TradeDirection,
        tradeDate: tradeJournal.tradeDate,
        notes: tradeJournal.notes,
        createdAt: tradeJournal.createdAt,
        updatedAt: tradeJournal.updatedAt,
      },
    });
  }
}
