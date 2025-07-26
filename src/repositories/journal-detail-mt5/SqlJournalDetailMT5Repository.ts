import { PrismaClient } from '@prisma/client';

import { JournalDetailMT5 } from '@/core/entities';
import { IJournalDetailMT5Repository } from '@/repositories/journal-detail-mt5';

const prisma = new PrismaClient();

export class SqlJournalDetailMT5Repository
  implements IJournalDetailMT5Repository
{
  async create(detail: JournalDetailMT5): Promise<void> {
    await prisma.journalDetailMT5.create({
      data: {
        id: detail.id.getValue(),
        accountId: detail.accountId.getValue(),
        externalTradeId: detail.externalTradeId,
        ticket: detail.ticket,
        symbol: detail.symbol,
        comment: detail.comment,
        lots: detail.lots,
        entryPrice: detail.entryPrice,
        stopPrice: detail.stopPrice,
        takePrice: detail.takePrice,
        investment: detail.investment,
        riskRewardRatio: detail.riskRewardRatio,
        result: detail.result,
        commission: detail.commission,
        swap: detail.swap,
        fee: detail.fee,
        time: detail.time,
        type: detail.type,
        entry: detail.entry,
        reason: detail.reason,
        orderId: detail.orderId,
        positionId: detail.positionId,
        magic: detail.magic,
      },
    });
  }

  async createMany(details: JournalDetailMT5[]): Promise<void> {
    if (!details.length) return;
    await prisma.journalDetailMT5.createMany({
      data: details.map((d) => ({
        id: d.id.getValue(),
        accountId: d.accountId.getValue(),
        externalTradeId: d.externalTradeId,
        ticket: d.ticket,
        symbol: d.symbol,
        comment: d.comment,
        lots: d.lots,
        entryPrice: d.entryPrice,
        stopPrice: d.stopPrice,
        takePrice: d.takePrice,
        investment: d.investment,
        riskRewardRatio: d.riskRewardRatio,
        result: d.result,
        commission: d.commission,
        swap: d.swap,
        fee: d.fee,
        time: d.time,
        type: d.type,
        entry: d.entry,
        reason: d.reason,
        orderId: d.orderId,
        positionId: d.positionId,
        magic: d.magic,
      })),
      skipDuplicates: true,
    });
  }

  async findById(id: string): Promise<JournalDetailMT5 | null> {
    const detail = await prisma.journalDetailMT5.findUnique({ where: { id } });
    if (!detail) return null;

    return JournalDetailMT5.restore({
      id: detail.id,
      accountId: detail.accountId,
      externalTradeId: detail.externalTradeId,
      ticket: detail.ticket,
      symbol: detail.symbol,
      comment: detail.comment,
      lots: detail.lots,
      entryPrice: detail.entryPrice,
      stopPrice: detail.stopPrice,
      takePrice: detail.takePrice,
      investment: detail.investment,
      riskRewardRatio: detail.riskRewardRatio,
      result: detail.result,
      commission: detail.commission,
      swap: detail.swap,
      fee: detail.fee,
      time: detail.time,
      type: detail.type,
      entry: detail.entry,
      reason: detail.reason,
      orderId: detail.orderId,
      positionId: detail.positionId,
      magic: detail.magic,
    });
  }

  async findManyByAccountExternalTradeIdAndTickets(params: {
    accountId: string;
    positionId: string;
    tickets: string[];
  }): Promise<JournalDetailMT5[]> {
    const result = await prisma.journalDetailMT5.findMany({
      where: {
        accountId: params.accountId,
        externalTradeId: params.positionId,
        ticket: { in: params.tickets },
      },
    });
    return result.map(JournalDetailMT5.restore);
  }

  async listByExternalTradeId(
    accountId: string,
    externalTradeId: string,
  ): Promise<JournalDetailMT5[]> {
    const details = await prisma.journalDetailMT5.findMany({
      where: {
        accountId,
        externalTradeId,
      },
    });

    return details.map((detail) =>
      JournalDetailMT5.restore({
        id: detail.id,
        accountId: detail.accountId,
        externalTradeId: detail.externalTradeId,
        ticket: detail.ticket,
        symbol: detail.symbol,
        comment: detail.comment,
        lots: detail.lots,
        entryPrice: detail.entryPrice,
        stopPrice: detail.stopPrice,
        takePrice: detail.takePrice,
        investment: detail.investment,
        riskRewardRatio: detail.riskRewardRatio,
        result: detail.result,
        commission: detail.commission,
        swap: detail.swap,
        fee: detail.fee,
        time: detail.time,
        type: detail.type,
        entry: detail.entry,
        reason: detail.reason,
        orderId: detail.orderId,
        positionId: detail.positionId,
        magic: detail.magic,
      }),
    );
  }

  async listByAccountId(accountId: string): Promise<JournalDetailMT5[]> {
    const details = await prisma.journalDetailMT5.findMany({
      where: { accountId },
    });

    return details.map((detail) =>
      JournalDetailMT5.restore({
        id: detail.id,
        accountId: detail.accountId,
        externalTradeId: detail.externalTradeId,
        ticket: detail.ticket,
        symbol: detail.symbol,
        comment: detail.comment,
        lots: detail.lots,
        entryPrice: detail.entryPrice,
        stopPrice: detail.stopPrice,
        takePrice: detail.takePrice,
        investment: detail.investment,
        riskRewardRatio: detail.riskRewardRatio,
        result: detail.result,
        commission: detail.commission,
        swap: detail.swap,
        fee: detail.fee,
        time: detail.time,
        type: detail.type,
        entry: detail.entry,
        reason: detail.reason,
        orderId: detail.orderId,
        positionId: detail.positionId,
        magic: detail.magic,
      }),
    );
  }

  async deleteById(id: string): Promise<void> {
    await prisma.journalDetailMT5.delete({ where: { id } });
  }
}
