import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { SubscriptionPlan } from '@/core/entities';
import { ISubscriptionPlanRepository } from '@/repositories/subscription-plans';
import { SubscriptionPlanDTO } from '@/modules/subscription-plans/application/DTOs';

@injectable()
export class CreateSubscriptionPlanService {
  constructor(
    @inject(ioc.repositories.subscriptionPlan)
    private subscriptionPlan: ISubscriptionPlanRepository,
  ) {}

  async execute({
    name,
    description,
    price,
    features,
  }: SubscriptionPlanDTO): Promise<SubscriptionPlan> {
    const allExistentPlans = await this.subscriptionPlan.findAll();

    const isDuplicate = allExistentPlans.some(
      (plan) =>
        plan.name.toLowerCase() === name.toLowerCase() || plan.price === price,
    );

    if (isDuplicate) {
      throw new CustomError({
        message: 'Já existe um plano com esse nome ou preço.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const plan = SubscriptionPlan.create({
      name,
      description,
      price,
      features,
    });

    await this.subscriptionPlan.create(plan);

    return plan;
  }
}
