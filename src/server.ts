import cors from 'cors';
import 'reflect-metadata';
import express, { type Request, type Response, type Express } from 'express';

import { routes } from '@/routes/v1';
import { errorHandler } from '@/middlewares';

import { User } from '@/core/entities';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

export const createServer = (): Express => {
  const app = express();

  app
    .disable('x-powered-by')
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(
      cors({
        origin: ['*', 'http://localhost:3000'],
      }),
    );

  app.get('/health', (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use('/v1', routes);

  app.use(errorHandler);

  return app;
};
