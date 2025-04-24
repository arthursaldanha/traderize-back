import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { ioc } from '@/ioc';
import { env } from '@/libs/envs';
import { CustomError } from '@/errors';
import { container } from '@/libs/container';
import { IUserRepository } from '@/repositories/user';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    token = '';
  }

  try {
    const { id } = verify(token, env.JWT_SECRET) as { id: string };

    const userRepository = container.get<IUserRepository>(
      ioc.repositories.userRepository,
    );

    const user = await userRepository.findUserAndPlanByUserId(id);

    if (!user) {
      throw new CustomError({
        message: 'Usuário não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log('Error isAuthenticated', error);
    throw new CustomError({
      message: 'Token JWT inválido.',
      statusCode: StatusCodes.FORBIDDEN,
    });
  }
};
