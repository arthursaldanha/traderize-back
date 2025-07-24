import { Entity } from '@/core/entity';
import { Uuid, Cuid } from '@/core/value-objects';

export class Account extends Entity {
  constructor(
    readonly id: Uuid,
    readonly userId: Cuid,
    readonly market: string[],
    readonly currency: string,
    readonly platform: string,
    readonly isPropFirm: boolean,
    readonly broker: string,
    readonly externalId: string,
    readonly description: string | null,
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
    externalId,
    description,
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
    externalId: string;
    description: string | null;
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
      new Cuid(userId),
      market,
      currency,
      platform,
      isPropFirm,
      broker,
      externalId,
      description,
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
    externalId: string;
    description: string | null;
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
      new Cuid(data.userId),
      data.market,
      data.currency,
      data.platform,
      data.isPropFirm,
      data.broker,
      data.externalId,
      data.description,
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
      externalId: this.externalId,
      description: this.description,
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
