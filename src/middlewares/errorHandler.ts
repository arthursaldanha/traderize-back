import { NextFunction, Request, Response } from 'express';

import { env } from '@/libs/envs';
import { getErrorMessage } from '@/utils/errors';
import { CustomError } from '@/errors/CustomError';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent || env.APP_DEBUG) {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  res.status(500).json({
    message:
      getErrorMessage(error) ||
      'An error occurred. Please view logs for more details',
  });
}
