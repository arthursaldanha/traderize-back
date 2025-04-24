import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ioc } from '@/ioc';

import { CustomError } from '@/errors';
import { ISubscriptionPlanRepository } from '@/repositories/subscription-plans';
import { SubscriptionPlanDTO } from '@/modules/subscription-plans/application/DTOs';
import { SubscriptionPlan } from '@/core/entities';

@injectable()
export class EditSubscriptionPlanService {
  constructor(
    @inject(ioc.repositories.subscriptionPlan)
    private subscriptionPlan: ISubscriptionPlanRepository,
  ) {}

  async execute(
    id: string,
    { name, description, price, features }: SubscriptionPlanDTO,
  ): Promise<SubscriptionPlan> {
    const existingPlan = await this.subscriptionPlan.findById(id);

    if (!existingPlan) {
      throw new CustomError({
        message: 'Plano de assinatura não encontrado.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const allExistentPlans = await this.subscriptionPlan.findAll();

    const isDuplicate = allExistentPlans.some(
      (plan) =>
        (plan.name.toLowerCase() === name.toLowerCase() ||
          plan.price === price) &&
        plan.id.getValue() !== id,
    );

    if (isDuplicate) {
      throw new CustomError({
        message: 'Já existe um plano com esse nome ou preço.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const updatedPlan = SubscriptionPlan.create({
      id,
      name,
      description,
      price,
      features,
      createdAt: existingPlan.createdAt,
      updatedAt: new Date(),
    });

    await this.subscriptionPlan.update(updatedPlan);

    return updatedPlan;
  }
}
