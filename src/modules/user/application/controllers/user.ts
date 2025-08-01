import { Request, Response } from 'express';

export class UserController {
  static async findUser(req: Request, res: Response) {
    res.status(200).json(req.user.toJSON());
  }
}
