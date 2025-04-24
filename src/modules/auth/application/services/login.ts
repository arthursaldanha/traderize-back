import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { env } from '@/libs/envs';
import { CustomError } from '@/errors';
import { LoginDTO } from '@/modules/auth/application/DTOs';
import { IAuthRepository } from '@/repositories/auth/IAuthRepository';

@injectable()
export class LoginService {
  constructor(
    @inject(ioc.repositories.authRepository)
    private authRepository: IAuthRepository,
  ) {}

  async execute({ email, password }: LoginDTO): Promise<{ token: string }> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new CustomError({
        message: 'Usuário ou senha inválidos.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const isSamePassword = await bcrypt.compare(
      password,
      user.password.getValue(),
    );

    if (!isSamePassword) {
      throw new CustomError({
        message: 'Usuário ou senha inválidos.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const token = jwt.sign(
      { id: user.id.getValue(), email: user.email.getValue() },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_SECRET_EXPIRES,
      },
    );

    return { token };
  }
}
