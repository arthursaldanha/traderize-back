import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { User } from '@/core/entities';
import { CustomError } from '@/errors';

export const isAllowedRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user;
    const userRole = user.getRole();

    if (!allowedRoles.includes(String(userRole))) {
      throw new CustomError({
        message:
          'Acesso negado. Você não tem permissão para acessar este recurso.',
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    next();
  };
};
