import { Router } from 'express';
import { AnalyticsController } from '../controller/analytics.controller';

const analyticRouter = Router();
const analyticsController = new AnalyticsController();

analyticRouter.get('/all', analyticsController.getAnalytics);
analyticRouter.get('/sales-report', analyticsController.getSalesReport);

export default analyticRouter;
