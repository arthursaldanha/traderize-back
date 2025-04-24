import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { ValidateOtpDTO } from '@/modules/auth/application/DTOs';
import { IAuthRepository } from '@/repositories/auth/IAuthRepository';

@injectable()
export class ValidateOtpService {
  constructor(
    @inject(ioc.repositories.authRepository)
    private authRepository: IAuthRepository,
  ) {}

  async execute({ email, token }: ValidateOtpDTO): Promise<void> {
    const otp = await this.authRepository.findActiveOtpByEmail(email);

    if (!otp) {
      throw new CustomError({
        message: 'Código de verificação não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (otp.isExpired()) {
      throw new CustomError({
        message: 'O código de verificação expirou.',
        statusCode: StatusCodes.GONE,
      });
    }

    if (!otp.isEqual(token)) {
      throw new CustomError({
        message: 'Código de verificação inválido.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    await this.authRepository.deleteOtpById(otp.id.getValue());
  }
}
