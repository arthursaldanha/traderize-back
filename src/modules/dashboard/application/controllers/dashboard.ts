import { Request, Response } from 'express';

import { container } from '@/libs/container';

import { GetDashboardAnalyticsService } from '@/modules/dashboard/application/services/dashboard';

export class DashboardController {
  static async dashboard(req: Request, res: Response) {
    const { user } = req;

    const analytics = await container
      .resolve(GetDashboardAnalyticsService)
      .execute({ user, accountIds: ['01969c61-26c9-760d-81ff-2fd4ed2b0cab'] });

    res.status(201).json(analytics);
  }
}
