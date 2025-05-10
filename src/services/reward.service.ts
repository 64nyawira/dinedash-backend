import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RewardService {
  // Create a new reward
  async createReward(name: string, description: string, pointsCost: number) {
    return prisma.reward.create({
      data: { name, description, pointsCost },
    });
  }

  // View all rewards
  async getAllRewards() {
    return prisma.reward.findMany();
  }

  // Update a reward
  async updateReward(rewardId: string, name?: string, description?: string, pointsCost?: number) {
    return prisma.reward.update({
      where: { id: rewardId },
      data: { name, description, pointsCost },
    });
  }

  // Delete a reward
  async deleteReward(rewardId: string) {
    return prisma.reward.delete({ where: { id: rewardId } });
  }
}
