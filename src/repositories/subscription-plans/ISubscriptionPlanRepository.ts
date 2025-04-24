import { SubscriptionPlan } from '@/core/entities';

export interface ISubscriptionPlanRepository {
  create(plan: SubscriptionPlan): Promise<void>;
  findAll(): Promise<SubscriptionPlan[]>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  findByName(name: string): Promise<SubscriptionPlan | null>;
  update(plan: SubscriptionPlan): Promise<void>;
}
