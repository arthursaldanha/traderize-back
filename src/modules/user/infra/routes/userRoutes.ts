import { Router } from 'express';

import { isAuthenticated } from '@/middlewares';

import { UserController } from '@/modules/user/application/controllers/user';

const userRoutes: Router = Router();

userRoutes.get('/', isAuthenticated, UserController.findUser);

export { userRoutes };
