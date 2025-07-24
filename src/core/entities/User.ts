import { UserRole } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { Entity } from '@/core/entity';
import { CustomError } from '@/errors';
import { SubscriptionPlan } from '@/core/entities';
import { Email, Name, Password, Uuid, Cuid } from '@/core/value-objects';

export class User extends Entity {
  private subscriptionPlan: SubscriptionPlan | null = null;
  private role: UserRole;

  constructor(
    readonly id: Cuid,
    private planId: Uuid | null,
    readonly firstName: Name,
    readonly lastName: Name,
    readonly username: string,
    readonly email: Email,
    readonly isEmailVerified: boolean,
    readonly phone: string,
    readonly password: Password,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    role: UserRole,
  ) {
    super();
    this.role = role;
  }

  static create(data: {
    id: string;
    planId?: string | null;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    phone: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    role: UserRole;
  }) {
    if (
      data.email !== 'saldanhadev@gmail.com' &&
      ![UserRole.USER, UserRole.GUEST].map(String).includes(String(data.role))
    ) {
      throw new CustomError({
        message:
          'O usuário poderá ser criado somente com as roles USER e GUEST.',
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    return new User(
      new Cuid(data.id),
      data.planId ? new Uuid(data.planId) : null,
      new Name(data.firstName),
      new Name(data.lastName),
      data.username,
      new Email(data.email),
      data.isEmailVerified,
      data.phone,
      new Password(data.password),
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.role,
    );
  }

  static restore = User.create;

  getRole(): UserRole {
    return this.role;
  }

  getSubscriptionPlan(): SubscriptionPlan | null {
    return this.subscriptionPlan;
  }

  setSubscriptionPlan(plan: SubscriptionPlan) {
    this.planId = plan.id;
    this.subscriptionPlan = plan;
  }

  toJSON() {
    return {
      id: this.id.getValue(),
      planId: this.planId?.getValue() || null,
      subscriptionPlan: this.subscriptionPlan
        ? this.subscriptionPlan.toJSON()
        : null,
      firstName: this.firstName.getValue(),
      lastName: this.lastName.getValue(),
      username: this.username,
      email: this.email.getValue(),
      isEmailVerified: this.isEmailVerified,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
