import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class TradeAccount extends Entity {
  constructor(
    readonly id: Uuid,
    readonly userId: Uuid,
    readonly market: string[],
    readonly currency: string,
    readonly platform: string,
    readonly isPropFirm: boolean,
    readonly broker: string,
    private initialBalance: number,
    private currentBalance: number,
    private floatingBalance: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super();
  }

  static create({
    id,
    userId,
    market,
    currency,
    platform,
    isPropFirm,
    broker,
    initialBalance,
    currentBalance,
    createdAt,
    updatedAt,
  }: {
    id?: string;
    userId: string;
    market: string[];
    currency: string;
    platform: string;
    isPropFirm: boolean;
    broker: string;
    initialBalance: number;
    currentBalance: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): TradeAccount {
    return new TradeAccount(
      id ? new Uuid(id) : new Uuid(),
      new Uuid(userId),
      market,
      currency,
      platform,
      isPropFirm,
      broker,
      initialBalance,
      currentBalance,
      currentBalance,
      createdAt || new Date(),
      updatedAt || new Date(),
    );
  }

  static restore(data: {
    id: string;
    userId: string;
    market: string[];
    currency: string;
    platform: string;
    isPropFirm: boolean;
    broker: string;
    initialBalance: number;
    currentBalance: number;
    floatingBalance: number;
    createdAt: Date;
    updatedAt: Date;
  }): TradeAccount {
    return new TradeAccount(
      new Uuid(data.id),
      new Uuid(data.userId),
      data.market,
      data.currency,
      data.platform,
      data.isPropFirm,
      data.broker,
      data.initialBalance,
      data.currentBalance,
      data.floatingBalance,
      data.createdAt,
      data.updatedAt,
    );
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('O valor do depósito deve ser positivo.');
    this.floatingBalance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error('O valor do saque deve ser positivo.');
    if (amount > this.currentBalance) throw new Error('Saldo insuficiente.');
    this.floatingBalance -= amount;
  }

  updateFloatingBalance(tradeImpact: number): void {
    this.floatingBalance += tradeImpact;
  }

  getInitialBalance(): number {
    return this.initialBalance;
  }

  getCurrentBalance(): number {
    return this.currentBalance;
  }

  getFloatingBalance(): number {
    return this.floatingBalance;
  }

  toJSON() {
    return {
      id: this.id.getValue(),
      userId: this.userId.getValue(),
      market: this.market,
      currency: this.currency,
      platform: this.platform,
      isPropFirm: this.isPropFirm,
      broker: this.broker,
      initialBalance: this.initialBalance,
      currentBalance: this.currentBalance,
      floatingBalance: this.floatingBalance,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
