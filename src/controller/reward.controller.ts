import { Request, Response } from 'express';
import { RewardService } from '../services/reward.service';

const rewardService = new RewardService();

export class RewardController {
  async createReward(req: Request, res: Response) {
    try {
      const { name, description, pointsCost } = req.body;
      const reward = await rewardService.createReward(name, description, pointsCost);
      res.status(201).json(reward);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error creating reward' });
    }
  }

  async getAllRewards(req: Request, res: Response) {
    try {
      const rewards = await rewardService.getAllRewards();
      res.status(200).json(rewards);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching rewards' });
    }
  }

  async updateReward(req: Request, res: Response) {
    try {
      const { rewardId } = req.params;
      const { name, description, pointsCost } = req.body;
      const updatedReward = await rewardService.updateReward(rewardId, name, description, pointsCost);
      res.status(200).json(updatedReward);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error updating reward' });
    }
  }

  async deleteReward(req: Request, res: Response) {
    try {
      const { rewardId } = req.params;
      await rewardService.deleteReward(rewardId);
      res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error deleting reward' });
    }
  }
}
