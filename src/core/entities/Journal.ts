import { Entity } from '@/core/entity';
import { Strategy, JournalDetailMT5 } from '@/core/entities';
import { Uuid } from '@/core/value-objects';

export class Journal extends Entity {
  readonly id: Uuid;
  readonly accountId: Uuid;
  private strategyId: Uuid | null;
  externalTradeId: string;
  symbol: string;
  entryPrice: string;
  stopPrice: string;
  takePrices: string[];
  investment: string;
  lots: string;
  result: string | null;
  commission: string | null;
  swap: string | null;
  fee: string | null;
  total: string | null;
  riskRewardRatio: string | null;
  imageUrls: string[];
  status: string;
  direction: string;
  timeDateStart: Date;
  timeDateEnd: Date | null;
  tradeDuration: string | null;
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
    entryPrice: string,
    stopPrice: string,
    takePrices: string[],
    investment: string,
    lots: string,
    result: string | null,
    commission: string | null,
    swap: string | null,
    fee: string | null,
    total: string | null,
    riskRewardRatio: string | null,
    imageUrls: string[],
    status: string,
    direction: string,
    timeDateStart: Date,
    timeDateEnd: Date | null,
    tradeDuration: string | null,
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
    this.entryPrice = entryPrice;
    this.stopPrice = stopPrice;
    this.takePrices = takePrices;
    this.investment = investment;
    this.lots = lots;
    this.result = result;
    this.commission = commission;
    this.swap = swap;
    this.fee = fee;
    this.total = total;
    this.riskRewardRatio = riskRewardRatio;
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
    entryPrice: string;
    stopPrice: string;
    takePrices: string[];
    investment: string;
    lots: string;
    result?: string | null;
    commission?: string | null;
    swap?: string | null;
    fee?: string | null;
    total?: string | null;
    riskRewardRatio?: string | null;
    imageUrls: string[];
    status: string;
    direction: string;
    timeDateStart: Date;
    timeDateEnd?: Date | null;
    tradeDuration?: string | null;
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
    entryPrice: string;
    stopPrice: string;
    takePrices: string[];
    investment: string;
    lots: string;
    result?: string | null;
    commission?: string | null;
    swap?: string | null;
    fee?: string | null;
    total?: string | null;
    riskRewardRatio?: string | null;
    imageUrls: string[];
    status: string;
    direction: string;
    timeDateStart: Date;
    timeDateEnd?: Date | null;
    tradeDuration?: string | null;
    notes?: string | null;
    detailsMetaTrader5?: JournalDetailMT5[];
  }): void {
    this.strategyId = data.strategyId ? new Uuid(data.strategyId) : null;
    this.externalTradeId = data.externalTradeId;
    this.entryPrice = data.entryPrice;
    this.stopPrice = data.stopPrice;
    this.takePrices = data.takePrices;
    this.investment = data.investment;
    this.lots = data.lots;
    this.result = data.result ?? null;
    this.commission = data.commission ?? null;
    this.swap = data.swap ?? null;
    this.fee = data.fee ?? null;
    this.total = data.total ?? null;
    this.riskRewardRatio = data.riskRewardRatio ?? null;
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
      entryPrice: this.entryPrice,
      stopPrice: this.stopPrice,
      takePrices: this.takePrices,
      investment: this.investment,
      lots: this.lots,
      result: this.result,
      commission: this.commission,
      swap: this.swap,
      fee: this.fee,
      total: this.total,
      riskRewardRatio: this.riskRewardRatio,
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
