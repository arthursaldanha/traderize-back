import { PrismaClient } from '@prisma/client';

import { User, OtpCode } from '@/core/entities';
import { IAuthRepository } from '@/repositories/auth/IAuthRepository';

const prisma = new PrismaClient();

export class SqlAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return User.restore(user);
  }

  async findUserByUsernameAndEmail({
    email,
    username,
  }: {
    username: string;
    email: string;
  }): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: { equals: username } }, { email: { equals: email } }],
      },
    });

    if (!user) return null;

    return User.restore(user);
  }

  async saveUser(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id.getValue(),
        planId: user.getSubscriptionPlan()?.id.getValue() || null,
        firstName: user.firstName.getValue(),
        lastName: user.lastName.getValue(),
        username: user.username,
        email: user.email.getValue(),
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
        password: user.password.getValue(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async saveOtpCode(otpCode: OtpCode): Promise<void> {
    await prisma.otpCode.create({
      data: {
        id: otpCode.id.getValue(),
        userId: otpCode.userId.getValue(),
        email: otpCode.email.getValue(),
        reason: otpCode.reason,
        token: otpCode.token,
        expiresAt: otpCode.expiresAt,
        createdAt: otpCode.createdAt,
      },
    });
  }

  async findActiveOtpByEmail(email: string): Promise<OtpCode | null> {
    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return otp ? OtpCode.restore(otp) : null;
  }

  async deleteOtpById(otpId: string): Promise<void> {
    await prisma.otpCode.delete({
      where: { id: otpId },
    });
  }
}
