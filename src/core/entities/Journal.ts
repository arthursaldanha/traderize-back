import { Decimal } from '@prisma/client/runtime/library';

import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';
import { Strategy, JournalDetailMT5 } from '@/core/entities';

function toDecimal(val: string | number | Decimal): Decimal {
  return val instanceof Decimal ? val : new Decimal(val);
}
function decimalArray(vals: (string | number | Decimal)[]): Decimal[] {
  return vals.map(toDecimal);
}
function nullableDecimal(
  val?: string | number | Decimal | null,
): Decimal | null {
  if (val === null || val === undefined) return null;
  return toDecimal(val);
}
function decimalToString(val?: Decimal | null): string | null {
  if (!val) return null;
  return val.toString();
}
function decimalArrayToString(vals: Decimal[]): string[] {
  return vals.map((d) => d.toString());
}

export class Journal extends Entity {
  readonly id: Uuid;
  readonly accountId: Uuid;
  private strategyId: Uuid | null;
  externalTradeId: string;
  symbol: string;
  entryPrice: Decimal;
  stopPrice: Decimal;
  takePrices: Decimal[];
  investment: Decimal;
  lots: Decimal;
  result: Decimal | null;
  commission: Decimal | null;
  swap: Decimal | null;
  fee: Decimal | null;
  total: Decimal | null;
  riskRewardRatio: Decimal | null;
  imageUrls: string[];
  status: string;
  direction: string;
  timeDateStart: Date;
  timeDateEnd: Date | null;
  tradeDuration: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;

  strategy: Strategy | null = null;
  detailsMetaTrader5?: JournalDetailMT5[];

  constructor(
    id: Uuid,
    accountId: Uuid,
    strategyId: Uuid | null,
    externalTradeId: string,
    symbol: string,
    entryPrice: string | number | Decimal,
    stopPrice: string | number | Decimal,
    takePrices: (string | number | Decimal)[],
    investment: string | number | Decimal,
    lots: string | number | Decimal,
    result: string | number | Decimal | null,
    commission: string | number | Decimal | null,
    swap: string | number | Decimal | null,
    fee: string | number | Decimal | null,
    total: string | number | Decimal | null,
    riskRewardRatio: string | number | Decimal | null,
    imageUrls: string[],
    status: string,
    direction: string,
    timeDateStart: Date,
    timeDateEnd: Date | null,
    tradeDuration: number | null,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date,
    detailsMetaTrader5?: JournalDetailMT5[],
  ) {
    super();
    this.id = id;
    this.accountId = accountId;
    this.strategyId = strategyId;
    this.externalTradeId = externalTradeId;
    this.symbol = symbol;
    this.entryPrice = toDecimal(entryPrice);
    this.stopPrice = toDecimal(stopPrice);
    this.takePrices = decimalArray(takePrices);
    this.investment = toDecimal(investment);
    this.lots = toDecimal(lots);
    this.result = nullableDecimal(result);
    this.commission = nullableDecimal(commission);
    this.swap = nullableDecimal(swap);
    this.fee = nullableDecimal(fee);
    this.total = nullableDecimal(total);
    this.riskRewardRatio = nullableDecimal(riskRewardRatio);
    this.imageUrls = imageUrls;
    this.status = status;
    this.direction = direction;
    this.timeDateStart = timeDateStart;
    this.timeDateEnd = timeDateEnd;
    this.tradeDuration = tradeDuration;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.detailsMetaTrader5 = detailsMetaTrader5;
  }

  static create(data: {
    id?: string;
    accountId: string;
    strategyId?: string | null;
    externalTradeId: string;
    symbol: string;
    entryPrice: string | number | Decimal;
    stopPrice: string | number | Decimal;
    takePrices: (string | number | Decimal)[];
    investment: string | number | Decimal;
    lots: string | number | Decimal;
    result?: string | number | Decimal | null;
    commission?: string | number | Decimal | null;
    swap?: string | number | Decimal | null;
    fee?: string | number | Decimal | null;
    total?: string | number | Decimal | null;
    riskRewardRatio?: string | number | Decimal | null;
    imageUrls: string[];
    status: string;
    direction: string;
    timeDateStart: Date;
    timeDateEnd?: Date | null;
    tradeDuration?: number | null;
    notes?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    detailsMetaTrader5?: JournalDetailMT5[];
  }) {
    return new Journal(
      data.id ? new Uuid(data.id) : new Uuid(),
      new Uuid(data.accountId),
      data.strategyId ? new Uuid(data.strategyId) : null,
      data.externalTradeId,
      data.symbol,
      data.entryPrice,
      data.stopPrice,
      data.takePrices,
      data.investment,
      data.lots,
      data.result ?? null,
      data.commission ?? null,
      data.swap ?? null,
      data.fee ?? null,
      data.total ?? null,
      data.riskRewardRatio ?? null,
      data.imageUrls,
      data.status,
      data.direction,
      data.timeDateStart,
      data.timeDateEnd ?? null,
      data.tradeDuration ?? null,
      data.notes ?? null,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.detailsMetaTrader5 ?? [],
    );
  }

  static restore = Journal.create;

  getStrategyId(): Uuid | null {
    return this.strategyId;
  }

  getStrategy(): Strategy | null {
    return this.strategy;
  }

  setStrategy(strategy: Strategy | null) {
    this.strategy = strategy;
    this.strategyId = strategy?.id || null;
  }

  setJournalDetailMt5(details: JournalDetailMT5[]) {
    this.detailsMetaTrader5 = details;
  }

  updateDetails(data: {
    strategyId?: string | null;
    externalTradeId: string;
    entryPrice: string | number | Decimal;
    stopPrice: string | number | Decimal;
    takePrices: (string | number | Decimal)[];
    investment: string | number | Decimal;
    lots: string | number | Decimal;
    result?: string | number | Decimal | null;
    commission?: string | number | Decimal | null;
    swap?: string | number | Decimal | null;
    fee?: string | number | Decimal | null;
    total?: string | number | Decimal | null;
    riskRewardRatio?: string | number | Decimal | null;
    imageUrls: string[];
    status: string;
    direction: string;
    timeDateStart: Date;
    timeDateEnd?: Date | null;
    tradeDuration?: number | null;
    notes?: string | null;
    detailsMetaTrader5?: JournalDetailMT5[];
  }): void {
    this.strategyId = data.strategyId ? new Uuid(data.strategyId) : null;
    this.externalTradeId = data.externalTradeId;
    this.entryPrice = toDecimal(data.entryPrice);
    this.stopPrice = toDecimal(data.stopPrice);
    this.takePrices = decimalArray(data.takePrices);
    this.investment = toDecimal(data.investment);
    this.lots = toDecimal(data.lots);
    this.result = nullableDecimal(data.result);
    this.commission = nullableDecimal(data.commission);
    this.swap = nullableDecimal(data.swap);
    this.fee = nullableDecimal(data.fee);
    this.total = nullableDecimal(data.total);
    this.riskRewardRatio = nullableDecimal(data.riskRewardRatio);
    this.imageUrls = data.imageUrls;
    this.status = data.status;
    this.direction = data.direction;
    this.timeDateStart = data.timeDateStart;
    this.timeDateEnd = data.timeDateEnd ?? null;
    this.tradeDuration = data.tradeDuration ?? null;
    this.notes = data.notes ?? null;
    this.detailsMetaTrader5 = data.detailsMetaTrader5 ?? undefined;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id.getValue(),
      accountId: this.accountId.getValue(),
      strategyId: this.strategyId?.getValue() || null,
      externalTradeId: this.externalTradeId,
      symbol: this.symbol,
      entryPrice: this.entryPrice.toString(),
      stopPrice: this.stopPrice.toString(),
      takePrices: decimalArrayToString(this.takePrices),
      investment: this.investment.toString(),
      lots: this.lots.toString(),
      result: decimalToString(this.result),
      commission: decimalToString(this.commission),
      swap: decimalToString(this.swap),
      fee: decimalToString(this.fee),
      total: decimalToString(this.total),
      riskRewardRatio: decimalToString(this.riskRewardRatio),
      imageUrls: this.imageUrls,
      status: this.status,
      direction: this.direction,
      timeDateStart: this.timeDateStart.toISOString(),
      timeDateEnd: this.timeDateEnd ? this.timeDateEnd.toISOString() : null,
      tradeDuration: this.tradeDuration,
      notes: this.notes,
      strategy: this.strategy ? this.strategy.toJSON() : null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      detailsMetaTrader5: this.detailsMetaTrader5?.map((d) => d.toJSON()) ?? [],
    };
  }
}
