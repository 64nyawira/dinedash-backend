import { Request, Response } from 'express';
import { MultiSupportService } from '../services/multiSupport.service';

const multiSupportService = new MultiSupportService();

export class MultiSupportController {
  async convertCurrency(req: Request, res: Response) {
    try {
      const { amount, currency } = req.body;
      const convertedAmount = multiSupportService.convertCurrency(amount, currency);
      res.status(200).json({ convertedAmount });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error converting currency' });
    }
  }

  async translateInterface(req: Request, res: Response) {
    try {
      const { text, language } = req.body;
      const translatedText = await multiSupportService.translateInterface(text, language);
      res.status(200).json({ translatedText });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error translating text' });
    }
  }
}
