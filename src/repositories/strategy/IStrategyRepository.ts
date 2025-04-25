import { Strategy } from '@/core/entities';

export interface IStrategyRepository {
  create(strategy: Strategy): Promise<void>;
  findById(id: string): Promise<Strategy | null>;
  listByUserId(userId: string): Promise<Strategy[]>;
  update(strategy: Strategy): Promise<void>;
}
