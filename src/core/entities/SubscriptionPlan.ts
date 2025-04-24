import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class SubscriptionPlan extends Entity {
  constructor(
    readonly id: Uuid,
    readonly name: string,
    readonly description: string | null,
    readonly price: number,
    readonly features: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super();
  }

  static create(data: {
    id?: string;
    name: string;
    description?: string | null;
    price: number;
    features: Record<string, unknown> | string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new SubscriptionPlan(
      data.id ? new Uuid(data.id) : new Uuid(),
      data.name,
      data.description || null,
      data.price,
      typeof data.features === 'string'
        ? data.features
        : JSON.stringify(data.features),
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
    );
  }

  static restore = SubscriptionPlan.create;

  toJSON() {
    return {
      id: this.id.getValue(),
      name: this.name,
      description: this.description,
      price: this.price,
      features: JSON.parse(this.features),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
