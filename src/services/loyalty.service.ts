import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LoyaltyService {
    async addPoints(userId: string, totalAmount: number) {
        const pointsEarned = Math.floor(totalAmount / 10);
        console.log(`🚀 Adding ${pointsEarned} points to user: ${userId}`);
      
        let loyalty = await prisma.loyaltyPoints.findUnique({ where: { userId } });
      
        console.log(`🔍 Existing Loyalty Entry:`, loyalty);
      
        if (!loyalty) {
          console.log(`❌ No loyalty record found, creating one.`);
          loyalty = await prisma.loyaltyPoints.create({
            data: { userId, points: 0 },
          });
        }
      
        console.log(`✅ Updating points for user ${userId}...`);
      
        const updatedLoyalty = await prisma.loyaltyPoints.update({
          where: { userId },
          data: { points: { increment: pointsEarned } },
        });
      
        console.log(`🎉 Points updated successfully:`, updatedLoyalty);
        return updatedLoyalty;
      }
      

  // Redeem a reward using points
  async redeemReward(userId: string, rewardId: string) {
    const userLoyalty = await prisma.loyaltyPoints.findUnique({ where: { userId } });
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });

    if (!userLoyalty || !reward) {
      throw new Error('Invalid user or reward');
    }

    if (userLoyalty.points < reward.pointsCost) {
      throw new Error('Not enough points to redeem this reward');
    }

    // Deduct points and create redemption record
    await prisma.loyaltyPoints.update({
      where: { userId },
      data: { points: { decrement: reward.pointsCost } },
    });

    const redemption = await prisma.redemption.create({
      data: { userId, rewardId },
    });

    return redemption;
  }

  // Get user loyalty points
  async getUserPoints(userId: string) {
    const loyalty = await prisma.loyaltyPoints.findUnique({ where: { userId } });
  
    if (!loyalty) {
      return { userId, points: 0 }; // Ensure response is not null
    }
  
    return loyalty;
  }
  
}
