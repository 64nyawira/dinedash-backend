import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export class PaymentController {
  // Initiate Payment (M-Pesa STK Push)
  async initiatePayment(req: Request, res: Response) {
    try {
      const { userId, orderId, phoneNumber, amount } = req.body;
      const response = await paymentService.initiatePayment(userId, orderId, phoneNumber, amount);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error initiating payment' });
    }
  }

  // Handle M-Pesa Callback
  async handleCallback(req: Request, res: Response) {
    try {
      const response = await paymentService.handleCallback(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error processing payment callback' });
    }
  }

  // Cancel a Payment Transaction
  async cancelTransaction(req: Request, res: Response) {
    try {
      const { transactionId, amount } = req.body;
      const response = await paymentService.cancelTransaction(transactionId, amount);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error cancelling transaction' });
    }
  }

  // Get All Transactions
  async getAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await paymentService.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error retrieving transactions' });
    }
  }

  // Get Transaction Receipt
  async getTransactionReceipt(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const receipt = await paymentService.getTransactionReceipt(transactionId);
      res.status(200).json(receipt);
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Transaction not found' });
    }
  }
}
