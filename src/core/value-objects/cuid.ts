/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { init, isCuid } from '@paralleldrive/cuid2';

import { CustomError } from '@/errors';

export class Cuid {
  protected readonly value: any;

  constructor(id?: string) {
    if ((id || id === null) && !Cuid.validate(id)) {
      throw new CustomError({
        message: `CUID inválido: ${id}`,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
    this.value = id || init({ length: 16 });
  }

  getValue(): string {
    return this.value;
  }

  isEqual(other: Cuid): boolean {
    return this.value === other.getValue();
  }

  static validate(id?: string) {
    return isCuid(id ?? '');
  }
}
