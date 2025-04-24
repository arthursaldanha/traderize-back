import { Router } from 'express';

import { isAuthenticated, parseDataWithSchema } from '@/middlewares';

import { createOtpSchema, loginSchema, registerSchema, validateOtpSchema } from '@/modules/auth/application/DTOs';
import { AuthController } from '@/modules/auth/application/controllers/auth';

const authRoutes: Router = Router();

authRoutes.post(
  '/login',
  parseDataWithSchema(loginSchema),
  AuthController.login,
);

authRoutes.post(
  '/register',
  parseDataWithSchema(registerSchema),
  AuthController.register,
);

authRoutes.post(
  '/otp/create',
  parseDataWithSchema(createOtpSchema),
  AuthController.createOtp,
);

authRoutes.post(
  '/otp/validate',
  parseDataWithSchema(validateOtpSchema),
  AuthController.validateOtp,
);

authRoutes.get('/protected', isAuthenticated, AuthController.protectedRoute);

export { authRoutes };
