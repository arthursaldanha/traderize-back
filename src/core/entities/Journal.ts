import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';
import type { JournalComment, Strategy } from '@/core/entities';

export class Journal extends Entity {
  readonly id: Uuid;
  readonly accountId: Uuid;
  private strategyId: Uuid | null;
  asset: string;
  entryPrice: number;
  stopPrice: number;
  takePrices: number[];
  investment: number;
  lots: number;
  result: number | null;
  riskRewardRatio: number | null;
  status: string;
  imageUrls: string[];
  direction: string;
  tradeDate: Date;
  notes: string | null;
  private comments: JournalComment[] = [];
  private strategy: Strategy | null = null;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    id: Uuid,
    accountId: Uuid,
    strategyId: Uuid | null,
    asset: string,
    investment: number,
    entryPrice: number,
    stopPrice: number,
    takePrices: number[],
    lots: number,
    result: number | null,
    riskRewardRatio: number | null,
    status: string,
    imageUrls: string[],
    direction: string,
    tradeDate: Date,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.accountId = accountId;
    this.strategyId = strategyId;
    this.asset = asset;
    this.entryPrice = entryPrice;
    this.stopPrice = stopPrice;
    this.takePrices = takePrices;
    this.investment = investment;
    this.lots = lots;
    this.result = result;
    this.riskRewardRatio = riskRewardRatio;
    this.status = status;
    this.imageUrls = imageUrls;
    this.direction = direction;
    this.tradeDate = tradeDate;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(data: {
    id?: string;
    accountId: string;
    strategyId?: string | null;
    asset: string;
    investment: number;
    entryPrice: number;
    stopPrice: number;
    takePrices: number[];
    lots: number;
    result?: number | null;
    riskRewardRatio?: number | null;
    status: string;
    imageUrls: string[];
    direction: string;
    tradeDate: Date;
    notes?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new Journal(
      data.id ? new Uuid(data.id) : new Uuid(),
      new Uuid(data.accountId),
      data.strategyId ? new Uuid(data.strategyId) : null,
      data.asset,
      data.investment,
      data.entryPrice,
      data.stopPrice,
      data.takePrices,
      data.lots,
      data.result ?? null,
      data.riskRewardRatio ?? null,
      data.status,
      data.imageUrls,
      data.direction,
      new Date(data.tradeDate),
      data.notes ?? null,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
    );
  }

  static restore = Journal.create;

  setComments(comments: JournalComment[]) {
    this.comments = comments;
  }

  getComments(): JournalComment[] {
    return this.comments;
  }

  setStrategy(strategy: Strategy | null) {
    this.strategy = strategy;
    this.strategyId = strategy?.id || null;
  }

  getStrategyId(): Uuid | null {
    return this.strategyId;
  }

  getStrategy(): Strategy | null {
    return this.strategy;
  }

  updateDetails(data: {
    strategyId?: string | null;
    entryPrice: number;
    stopPrice: number;
    takePrices: number[];
    investment: number;
    lots: number;
    result?: number | null;
    riskRewardRatio?: number | null;
    status: string;
    imageUrls: string[];
    direction: string;
    tradeDate: Date;
    notes?: string | null;
  }): void {
    this.strategyId = data.strategyId ? new Uuid(data.strategyId) : null;
    this.entryPrice = data.entryPrice;
    this.stopPrice = data.stopPrice;
    this.takePrices = data.takePrices;
    this.investment = data.investment;
    this.lots = data.lots;
    this.result = data.result ?? null;
    this.riskRewardRatio = data.riskRewardRatio ?? null;
    this.status = data.status;
    this.imageUrls = data.imageUrls;
    this.direction = data.direction;
    this.tradeDate = new Date(data.tradeDate);
    this.notes = data.notes ?? null;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id.getValue(),
      accountId: this.accountId.getValue(),
      strategyId: this.strategyId?.getValue() || null,
      asset: this.asset,
      investment: this.investment,
      entryPrice: this.entryPrice,
      stopPrice: this.stopPrice,
      takePrices: this.takePrices,
      lots: this.lots,
      result: this.result,
      riskRewardRatio: this.riskRewardRatio,
      status: this.status,
      direction: this.direction,
      Date: this.tradeDate.toISOString(),
      notes: this.notes,
      strategy: this.strategy ? this.strategy.toJSON() : null,
      comments: this.comments.map((comment) => comment.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
