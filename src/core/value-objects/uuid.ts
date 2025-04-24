import { StatusCodes } from 'http-status-codes';
import { v7, validate as uuidValidate } from 'uuid';

import { CustomError } from '@/errors';

export class Uuid {
  protected readonly value: any;

  constructor(id?: string) {
    if ((id || id === null) && !Uuid.validate(id)) {
      throw new CustomError({
        message: `UUID inválido: ${id}`,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
    this.value = id || v7();
  }

  getValue(): string {
    return this.value;
  }

  isEqual(other: Uuid): boolean {
    return this.value === other.getValue();
  }

  static validate(id?: string) {
    return uuidValidate(id ?? '');
  }
}
