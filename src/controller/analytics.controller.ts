import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response) {
    try {
      const data = await analyticsService.getAnalytics();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching analytics' });
    }
  }

  async getSalesReport(req: Request, res: Response) {
    try {
      const report = await analyticsService.getSalesReport();
      res.status(200).json(report);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error generating sales report' });
    }
  }
}
