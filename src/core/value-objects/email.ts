import { StatusCodes } from 'http-status-codes';

import { CustomError } from '@/errors';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase();
  }

  private validate(email: string): void {
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      throw new CustomError({
        message: 'E-mail inválido.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
