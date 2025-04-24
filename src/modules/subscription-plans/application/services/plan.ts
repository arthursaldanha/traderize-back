import { User } from '@/core/entities';

import { Feature } from '@/modules/subscription-plans/domain/enums/feature';
import { PlanRules } from '@/modules/subscription-plans/domain/constants/planRules';

type PlanNames = keyof typeof PlanRules;
type FeatureRules = (typeof PlanRules)[PlanNames][Feature];

export class PlanService {
  static canAccess(user: User, feature: Feature): boolean {
    const plan = user.getSubscriptionPlan()?.name.toLowerCase() as PlanNames;

    if (!plan || !PlanRules[plan]) {
      return false;
    }

    const rule = PlanRules[plan][feature].isAllowed;

    if (rule === undefined || rule === false) {
      return false;
    }

    return true;
  }

  static getFeatureRules(user: User, feature: Feature): FeatureRules {
    const plan = user.getSubscriptionPlan()?.name.toLowerCase() as PlanNames;
    return PlanRules[plan][feature];
  }
}
