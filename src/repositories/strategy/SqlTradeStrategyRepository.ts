import { PrismaClient } from '@prisma/client';
import { TradeStrategy } from '@/core/entities';
import { ITradeStrategyRepository } from '@/repositories/strategy/ITradeStrategyRepository';

const prisma = new PrismaClient();

export class SqlTradeStrategyRepository implements ITradeStrategyRepository {
  async create(tradeStrategy: TradeStrategy): Promise<void> {
    await prisma.strategy.create({
      data: {
        id: tradeStrategy.id.getValue(),
        userId: tradeStrategy.userId.getValue(),
        name: tradeStrategy.name,
        description: tradeStrategy.description,
        isDefault: tradeStrategy.isDefault,
        imageUrls: tradeStrategy.imageUrls,
        createdAt: tradeStrategy.createdAt,
        updatedAt: tradeStrategy.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<TradeStrategy | null> {
    const tradeStrategy = await prisma.strategy.findUnique({
      where: { id },
    });

    if (!tradeStrategy) return null;

    return TradeStrategy.restore(tradeStrategy);
  }

  async listByUserId(userId: string): Promise<TradeStrategy[]> {
    const tradeStrategies = await prisma.strategy.findMany({
      where: { userId },
    });

    return tradeStrategies.map(TradeStrategy.restore);
  }

  async update(tradeStrategy: TradeStrategy): Promise<void> {
    await prisma.strategy.update({
      where: { id: tradeStrategy.id.getValue() },
      data: {
        name: tradeStrategy.name,
        description: tradeStrategy.description,
        isDefault: tradeStrategy.isDefault,
        imageUrls: tradeStrategy.imageUrls,
        updatedAt: tradeStrategy.updatedAt,
      },
    });
  }
}
