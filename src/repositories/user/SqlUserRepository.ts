import { PrismaClient } from '@prisma/client';

import { User, SubscriptionPlan } from '@/core/entities';
import { IUserRepository } from '@/repositories/user/IUserRepository';

const prisma = new PrismaClient();

export class SqlUserRepository implements IUserRepository {
  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.restore(user);
  }

  async findUserAndPlanByUserId(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });

    if (!user) return null;

    const restoredUser = User.restore(user);

    let subscriptionPlan: SubscriptionPlan | null;

    if (user.plan) {
      subscriptionPlan = SubscriptionPlan.create({
        id: user.plan?.id,
        name: user.plan?.name,
        description: user.plan?.description,
        price: Number(user.plan?.price),
        features: JSON.stringify(user.plan?.features),
        createdAt: user.plan?.createdAt,
        updatedAt: user.plan?.updatedAt,
      });

      restoredUser.setSubscriptionPlan(subscriptionPlan);
    }

    return restoredUser;
  }
}
