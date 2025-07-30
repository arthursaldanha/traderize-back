import { Request, Response } from 'express';

import { container } from '@/libs/container';

import { GetDashboardAnalyticsService } from '@/modules/dashboard/application/services/dashboard';

export class DashboardController {
  static async dashboard(req: Request, res: Response) {
    const { user } = req;

    const analytics = await container
      .resolve(GetDashboardAnalyticsService)
      .execute({ user, accountIds: ['01983f8e-937c-73b5-b50f-52b9425764d7'] });

    res.status(201).json(analytics);
  }
}
