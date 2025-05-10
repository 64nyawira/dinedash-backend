import { Router } from 'express';
import { RewardController } from '../controller/reward.controller';

const rewardRouter = Router();
const rewardController = new RewardController();

rewardRouter.post('/create', rewardController.createReward);
rewardRouter.get('/all', rewardController.getAllRewards);
rewardRouter.put('/update/:rewardId', rewardController.updateReward);
rewardRouter.delete('/delete/:rewardId', rewardController.deleteReward);

export default rewardRouter;
