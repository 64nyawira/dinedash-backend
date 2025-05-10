import { Router } from 'express';
import { LoyaltyController } from '../controller/loyalty.controller';

const loyaltyRouter = Router();
const loyaltyController = new LoyaltyController();

loyaltyRouter.get('/points/:userId', loyaltyController.getUserPoints);
loyaltyRouter.post('/redeem', loyaltyController.redeemReward);

export default loyaltyRouter;
