import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { User } from '@/core/entities';
import { CustomError } from '@/errors';
import { Cuid } from '@/core/value-objects';
import { RegisterDTO } from '@/modules/auth/application/DTOs';
import { IAuthRepository } from '@/repositories/auth/IAuthRepository';

@injectable()
export class RegisterService {
  constructor(
    @inject(ioc.repositories.authRepository)
    private authRepository: IAuthRepository,
  ) {}

  async execute({
    firstName,
    lastName,
    username,
    email,
    isEmailVerified = false,
    phone,
    password,
    planId,
  }: RegisterDTO): Promise<User> {
    const existingUser = await this.authRepository.findUserByUsernameAndEmail({
      username,
      email,
    });

    if (existingUser) {
      throw new CustomError({
        message: 'Usuário ou email já existe em nossa base de dados.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create({
      id: new Cuid().getValue(),
      planId,
      firstName,
      lastName,
      username,
      email,
      isEmailVerified,
      phone,
      role: UserRole.USER,
      password: hashedPassword,
    });

    await this.authRepository.saveUser(user);

    return user;
  }
}
