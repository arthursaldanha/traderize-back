import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class Strategy extends Entity {
  constructor(
    readonly id: Uuid,
    readonly userId: Uuid,
    readonly name: string,
    readonly description: string | null,
    readonly isDefault: boolean | null,
    readonly imageUrls: string[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super();
  }

  static create(data: {
    id?: string;
    userId: string;
    name: string;
    description?: string | null;
    isDefault?: boolean | null;
    imageUrls: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new Strategy(
      data.id ? new Uuid(data.id) : new Uuid(),
      new Uuid(data.userId),
      data.name,
      data.description || null,
      data.isDefault || false,
      data.imageUrls,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
    );
  }

  static restore = Strategy.create;

  toJSON() {
    return {
      id: this.id.getValue(),
      userId: this.userId.getValue(),
      name: this.name,
      description: this.description,
      isDefault: this.isDefault,
      imageUrls: this.imageUrls,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
