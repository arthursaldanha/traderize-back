import { StatusCodes } from 'http-status-codes';

import { CustomError } from '@/errors';

export class Password {
  private readonly value: string;

  constructor(password: string) {
    this.validate(password);
    this.value = password;
  }

  private validate(password: string): void {
    if (!password || typeof password !== 'string' || password.length < 8) {
      throw new CustomError({
        message: 'A senha deve ter pelo menos 8 caracteres.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.getValue();
  }
}
