/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JournalDetailMT5 as PrismaJournalDetailMT5 } from '@prisma/client';

// Conversor tipado
export function deepConvertDetailMT5(details: PrismaJournalDetailMT5[]): any[] {
  return details.map((d) => ({
    id: d.id,
    accountId: d.accountId,
    externalTradeId: d.externalTradeId,
    ticket: Number(d.ticket),
    symbol: d.symbol,
    comment: d.comment ?? null,
    lots: Number(d.lots),
    entryPrice: Number(d.entryPrice),
    stopPrice: Number(d.stopPrice),
    takePrice: Number(d.takePrice),
    investment: Number(d.investment),
    riskRewardRatio: Number(d.riskRewardRatio),
    result: Number(d.result),
    commission: Number(d.commission),
    swap: Number(d.swap),
    fee: Number(d.fee),
    time:
      typeof d.time === 'string'
        ? d.time
        : (d.time?.toISOString() ?? new Date().toISOString()),
    type: d.type,
    entry: d.entry,
    reason: d.reason,
    orderId: Number(d.orderId),
    positionId: Number(d.positionId),
    magic: Number(d.magic),
  }));
}
