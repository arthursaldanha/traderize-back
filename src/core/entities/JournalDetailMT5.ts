import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class JournalDetailMT5 extends Entity {
  readonly id: Uuid;
  accountId: Uuid;
  externalTradeId: string;
  ticket: number;
  symbol: string;
  comment?: string | null;
  lots: string;
  entryPrice: string;
  stopPrice: string;
  takePrice: string;
  investment: string;
  riskRewardRatio: string;
  result: string;
  commission: string;
  swap: string;
  fee: string;
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
    lots: string,
    entryPrice: string,
    stopPrice: string,
    takePrice: string,
    investment: string,
    riskRewardRatio: string,
    result: string,
    commission: string,
    swap: string,
    fee: string,
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
    this.lots = lots;
    this.entryPrice = entryPrice;
    this.stopPrice = stopPrice;
    this.takePrice = takePrice;
    this.investment = investment;
    this.riskRewardRatio = riskRewardRatio;
    this.result = result;
    this.commission = commission;
    this.swap = swap;
    this.fee = fee;
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
    lots: string;
    entryPrice: string;
    stopPrice: string;
    takePrice: string;
    investment: string;
    riskRewardRatio: string;
    result: string;
    commission: string;
    swap: string;
    fee: string;
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
      lots: this.lots,
      entryPrice: this.entryPrice,
      stopPrice: this.stopPrice,
      takePrice: this.takePrice,
      investment: this.investment,
      riskRewardRatio: this.riskRewardRatio,
      result: this.result,
      commission: this.commission,
      swap: this.swap,
      fee: this.fee,
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
