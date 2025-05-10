import { Request, Response } from 'express';
import { LoyaltyService } from '../services/loyalty.service';
const loyaltyService = new LoyaltyService();

export class LoyaltyController {
  async getUserPoints(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const points = await loyaltyService.getUserPoints(userId);
      res.status(200).json(points);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error retrieving points' });
    }
  }

  async redeemReward(req: Request, res: Response) {
    try {
      const { userId, rewardId } = req.body;
      const result = await loyaltyService.redeemReward(userId, rewardId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error redeeming reward' });
    }
  }
}
