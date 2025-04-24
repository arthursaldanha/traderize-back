import { StatusCodes } from 'http-status-codes';

import { CustomError } from '@/errors';

export class Id {
  private readonly id: string;

  constructor(id: string) {
    this.validate(id);
    this.id = id;
  }

  private validate(id: string | number): void {
    if (!id || (typeof id === 'string' && id.trim() === '')) {
      throw new CustomError({
        message: 'ID inválido. String vazia não é permitida.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!id || typeof id === 'number') {
      throw new CustomError({
        message: 'ID inválido.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  }

  toString(): string {
    return this.id.toString();
  }

  equals(other: Id): boolean {
    return this.id === other.value();
  }

  value(): string | number {
    return this.id;
  }
}
