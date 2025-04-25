import { Router } from 'express';

import {
  isAllowedRole,
  isAuthenticated,
  parseDataWithSchema,
} from '@/middlewares';

import { createAccountSchema } from '@/modules/account/application/DTOs';
import { AccountController } from '@/modules/account/application/controllers/account';

const accountRoutes: Router = Router();

accountRoutes.get('/', isAuthenticated, AccountController.listByUserId);

accountRoutes.post(
  '/',
  parseDataWithSchema(createAccountSchema),
  isAuthenticated,
  isAllowedRole('ADMIN', 'USER'),
  AccountController.create,
);

export { accountRoutes };
