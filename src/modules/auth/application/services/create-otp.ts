import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { OtpCode } from '@/core/entities';
import { CreateOtpDTO } from '@/modules/auth/application/DTOs';
import { IAuthRepository } from '@/repositories/auth/IAuthRepository';

@injectable()
export class CreateOtpService {
  constructor(
    @inject(ioc.repositories.authRepository)
    private authRepository: IAuthRepository,
  ) {}

  async execute({ email, reason }: CreateOtpDTO): Promise<void> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new CustomError({
        message: 'Usuário não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const existingOtp = await this.authRepository.findActiveOtpByEmail(
      user.email.getValue(),
    );

    if (existingOtp) {
      throw new CustomError({
        message:
          'Já existe um código de verificação ativo. Por favor, aguarde um instante e verifique seu e-mail.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const otpCode = OtpCode.create({
      userId: user.id.getValue(),
      email,
      reason,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.authRepository.saveOtpCode(otpCode);
  }
}
