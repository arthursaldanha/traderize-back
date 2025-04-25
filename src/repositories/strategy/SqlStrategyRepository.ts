import { PrismaClient } from '@prisma/client';

import { Strategy } from '@/core/entities';
import { IStrategyRepository } from '@/repositories/strategy';

const prisma = new PrismaClient();

export class SqlStrategyRepository implements IStrategyRepository {
  async create(stratey: Strategy): Promise<void> {
    await prisma.strategy.create({
      data: {
        id: stratey.id.getValue(),
        userId: stratey.userId.getValue(),
        name: stratey.name,
        description: stratey.description,
        isDefault: stratey.isDefault,
        imageUrls: stratey.imageUrls,
        createdAt: stratey.createdAt,
        updatedAt: stratey.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Strategy | null> {
    const strategy = await prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) return null;

    return Strategy.restore(strategy);
  }

  async listByUserId(userId: string): Promise<Strategy[]> {
    const strategies = await prisma.strategy.findMany({
      where: { userId },
    });

    return strategies.map(Strategy.restore);
  }

  async update(strategy: Strategy): Promise<void> {
    await prisma.strategy.update({
      where: { id: strategy.id.getValue() },
      data: {
        name: strategy.name,
        description: strategy.description,
        isDefault: strategy.isDefault,
        imageUrls: strategy.imageUrls,
        updatedAt: strategy.updatedAt,
      },
    });
  }
}
