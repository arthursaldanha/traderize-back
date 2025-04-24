import { Entity } from '@/core/entity';
import { Uuid } from '@/core/value-objects';

export class TradeJournalComment extends Entity {
  constructor(
    readonly id: Uuid,
    readonly tradeId: Uuid,
    readonly userId: Uuid,
    readonly classId: Uuid,
    readonly comment: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super();
  }

  static create(data: {
    id?: string;
    tradeId: string;
    userId: string;
    classId: string;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return new TradeJournalComment(
      data.id ? new Uuid(data.id) : new Uuid(),
      new Uuid(data.tradeId),
      new Uuid(data.userId),
      new Uuid(data.classId),
      data.comment,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
    );
  }

  static restore = TradeJournalComment.create;

  toJSON() {
    return {
      id: this.id.getValue(),
      tradeId: this.tradeId.getValue(),
      userId: this.userId.getValue(),
      classId: this.classId.getValue(),
      comment: this.comment,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
