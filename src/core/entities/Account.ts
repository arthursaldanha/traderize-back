import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class Account extends Entity {
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
    private credits: number,
    readonly disabled: boolean,
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
    floatingBalance,
    credits,
    disabled,
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
    floatingBalance: number;
    credits: number;
    disabled: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Account {
    return new Account(
      id ? new Uuid(id) : new Uuid(),
      new Uuid(userId),
      market,
      currency,
      platform,
      isPropFirm,
      broker,
      initialBalance,
      currentBalance,
      floatingBalance,
      credits,
      disabled,
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
    credits: number;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Account {
    return new Account(
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
      data.credits,
      data.disabled,
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

  updateFloatingBalance(Impact: number): void {
    this.floatingBalance += Impact;
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

  getCreditsBalance(): number {
    return this.credits;
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
      credits: this.credits,
      disabled: this.disabled,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
