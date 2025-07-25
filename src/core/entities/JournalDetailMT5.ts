import { Decimal } from '@prisma/client/runtime/library';

import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

function toDecimal(val: string | number | Decimal): Decimal {
  return val instanceof Decimal ? val : new Decimal(val);
}

export class JournalDetailMT5 extends Entity {
  readonly id: Uuid;
  accountId: Uuid;
  externalTradeId: string;
  ticket: number;
  symbol: string;
  comment?: string | null;
  lots: Decimal;
  entryPrice: Decimal;
  stopPrice: Decimal;
  takePrice: Decimal;
  investment: Decimal;
  riskRewardRatio: Decimal;
  result: Decimal;
  commission: Decimal;
  swap: Decimal;
  fee: Decimal;
  time: Date;
  type: string;
  entry: string;
  reason: string;
  orderId: number;
  positionId: number;
  magic: number;

  constructor(
    id: Uuid,
    accountId: Uuid,
    externalTradeId: string,
    ticket: number,
    symbol: string,
    comment: string | null,
    lots: string | number | Decimal,
    entryPrice: string | number | Decimal,
    stopPrice: string | number | Decimal,
    takePrice: string | number | Decimal,
    investment: string | number | Decimal,
    riskRewardRatio: string | number | Decimal,
    result: string | number | Decimal,
    commission: string | number | Decimal,
    swap: string | number | Decimal,
    fee: string | number | Decimal,
    time: Date,
    type: string,
    entry: string,
    reason: string,
    orderId: number,
    positionId: number,
    magic: number,
  ) {
    super();
    this.id = id;
    this.accountId = accountId;
    this.externalTradeId = externalTradeId;
    this.ticket = ticket;
    this.symbol = symbol;
    this.comment = comment;
    this.lots = toDecimal(lots);
    this.entryPrice = toDecimal(entryPrice);
    this.stopPrice = toDecimal(stopPrice);
    this.takePrice = toDecimal(takePrice);
    this.investment = toDecimal(investment);
    this.riskRewardRatio = toDecimal(riskRewardRatio);
    this.result = toDecimal(result);
    this.commission = toDecimal(commission);
    this.swap = toDecimal(swap);
    this.fee = toDecimal(fee);
    this.time = time;
    this.type = type;
    this.entry = entry;
    this.reason = reason;
    this.orderId = orderId;
    this.positionId = positionId;
    this.magic = magic;
  }

  static create(data: {
    id?: string;
    accountId: string;
    externalTradeId: string;
    ticket: number;
    symbol: string;
    comment?: string | null;
    lots: string | number | Decimal;
    entryPrice: string | number | Decimal;
    stopPrice: string | number | Decimal;
    takePrice: string | number | Decimal;
    investment: string | number | Decimal;
    riskRewardRatio: string | number | Decimal;
    result: string | number | Decimal;
    commission: string | number | Decimal;
    swap: string | number | Decimal;
    fee: string | number | Decimal;
    time: Date | string;
    type: string;
    entry: string;
    reason: string;
    orderId: number;
    positionId: number;
    magic: number;
  }) {
    return new JournalDetailMT5(
      data.id ? new Uuid(data.id) : new Uuid(),
      new Uuid(data.accountId),
      data.externalTradeId,
      data.ticket,
      data.symbol,
      data.comment ?? null,
      data.lots,
      data.entryPrice,
      data.stopPrice,
      data.takePrice,
      data.investment,
      data.riskRewardRatio,
      data.result,
      data.commission,
      data.swap,
      data.fee,
      typeof data.time === 'string' ? new Date(data.time) : data.time,
      data.type,
      data.entry,
      data.reason,
      data.orderId,
      data.positionId,
      data.magic,
    );
  }

  static restore = JournalDetailMT5.create;

  toJSON() {
    return {
      id: this.id.getValue(),
      accountId: this.accountId.getValue(),
      externalTradeId: this.externalTradeId,
      ticket: this.ticket,
      symbol: this.symbol,
      comment: this.comment,
      lots: this.lots.toString(),
      entryPrice: this.entryPrice.toString(),
      stopPrice: this.stopPrice.toString(),
      takePrice: this.takePrice.toString(),
      investment: this.investment.toString(),
      riskRewardRatio: this.riskRewardRatio.toString(),
      result: this.result.toString(),
      commission: this.commission.toString(),
      swap: this.swap.toString(),
      fee: this.fee.toString(),
      time: this.time.toISOString(),
      type: this.type,
      entry: this.entry,
      reason: this.reason,
      orderId: this.orderId,
      positionId: this.positionId,
      magic: this.magic,
    };
  }
}
