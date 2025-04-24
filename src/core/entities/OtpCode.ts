import { Entity } from '@/core/entity';
import { Email, Uuid } from '@/core/value-objects';

export class OtpCode extends Entity {
  constructor(
    readonly id: Uuid,
    readonly userId: Uuid,
    readonly email: Email,
    readonly token: string,
    readonly reason: string,
    readonly expiresAt: Date,
    readonly createdAt: Date,
  ) {
    super();
  }

  static generateOtp(): string {
    const digits = '0123456789';
    const otpArray = [];

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otpArray.push(digits.charAt(randomIndex));
    }

    return otpArray.join('');
  }

  static create(otpCode: {
    id?: string;
    userId: string;
    email: string;
    token?: string;
    reason: string;
    expiresAt: Date;
    createdAt?: Date;
  }) {
    return new OtpCode(
      otpCode.id ? new Uuid(otpCode.id) : new Uuid(),
      new Uuid(otpCode.userId),
      new Email(otpCode.email),
      otpCode.token ? otpCode.token : OtpCode.generateOtp(),
      otpCode.reason,
      otpCode.expiresAt,
      otpCode.createdAt || new Date(),
    );
  }

  static restore = OtpCode.create;

  isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  isEqual(token: string): boolean {
    return this.token === token;
  }

  toJSON() {
    return {
      id: this.id.getValue(),
      userId: this.userId.getValue(),
      email: this.email.getValue(),
      token: this.token,
      reason: this.reason,
      expiresAt: this.expiresAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }
}
