import { User, OtpCode } from '@/core/entities';

export interface IAuthRepository {
  saveUser(user: User): Promise<void>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsernameAndEmail(param: {
    username: string;
    email: string;
  }): Promise<User | null>;
  saveOtpCode(otpCode: OtpCode): Promise<void>;
  findActiveOtpByEmail(email: string): Promise<OtpCode | null>;
  deleteOtpById(otpId: string): Promise<void>;
}
