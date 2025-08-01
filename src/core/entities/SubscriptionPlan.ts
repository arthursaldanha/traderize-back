import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class SubscriptionPlan extends Entity {
  constructor(
    readonly id: Uuid,
    readonly name: string,
    readonly description: string | null,
    readonly price: number,
    readonly features: unknown,
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
    features: unknown;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new SubscriptionPlan(
      data.id ? new Uuid(data.id) : new Uuid(),
      data.name,
      data.description || null,
      data.price,
      data.features,
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
      features: JSON.parse(this.features as string),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
