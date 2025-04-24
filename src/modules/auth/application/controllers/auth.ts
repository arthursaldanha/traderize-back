import { Request, Response } from 'express';

import { container } from '@/libs/container';

import {
  CreateOtpService,
  LoginService,
  RegisterService,
  ValidateOtpService,
} from '@/modules/auth/application/services';

export class AuthController {
  static async register(req: Request, res: Response) {
    const user = await container.resolve(RegisterService).execute(req.body);
    res.status(201).json(user.toJSON());
  }

  static async login(req: Request, res: Response) {
    const token = await container.resolve(LoginService).execute(req.body);
    res.status(201).json(token);
  }

  static async createOtp(req: Request, res: Response) {
    await container.resolve(CreateOtpService).execute(req.body);
    res.status(201).send();
  }

  static async validateOtp(req: Request, res: Response) {
    await container.resolve(ValidateOtpService).execute(req.body);
    res.status(201).send();
  }

  static async protectedRoute(req: Request, res: Response) {
    res.json({ message: 'You are authenticated!' });
  }
}
