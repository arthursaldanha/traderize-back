import {
  PrismaClient,
  SubscriptionPlan as PrismaSubscriptionPlan,
} from '@prisma/client';

import { SubscriptionPlan } from '@/core/entities/SubscriptionPlan';
import { ISubscriptionPlanRepository } from '@/repositories/subscription-plans/ISubscriptionPlanRepository';

const prisma = new PrismaClient();

export class SqlSubscriptionPlanRepository
  implements ISubscriptionPlanRepository
{
  async findById(id: string): Promise<SubscriptionPlan | null> {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id } });
    return plan ? this.toDomain(plan) : null;
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { name } });
    return plan ? this.toDomain(plan) : null;
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const plans = await prisma.subscriptionPlan.findMany();
    return plans.map(this.toDomain);
  }

  async create(plan: SubscriptionPlan): Promise<void> {
    await prisma.subscriptionPlan.create({
      data: {
        id: plan.id.getValue(),
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      },
    });
  }

  async update(plan: SubscriptionPlan): Promise<void> {
    await prisma.subscriptionPlan.update({
      where: { id: plan.id.getValue() },
      data: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
        updatedAt: plan.updatedAt,
      },
    });
  }

  private toDomain(raw: PrismaSubscriptionPlan): SubscriptionPlan {
    return SubscriptionPlan.create({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      features: JSON.stringify(raw.features),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
