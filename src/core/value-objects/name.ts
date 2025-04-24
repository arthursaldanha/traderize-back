import { StatusCodes } from 'http-status-codes';

import { CustomError } from '@/errors';

export class Name {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new CustomError({
        message: 'O nome deve ter pelo menos 2 caracteres.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Name): boolean {
    return this.value === other.getValue();
  }
}
