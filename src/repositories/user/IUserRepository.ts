import { User } from '@/core/entities';

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserAndPlanByUserId(userId: string): Promise<User | null>;
}
