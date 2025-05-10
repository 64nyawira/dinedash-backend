import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export class PaymentService {
  private baseURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  private queryURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';
  private reversalURL = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request';
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');

    try {
      const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: `Basic ${auth}` },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching M-Pesa token:', error);
      throw new Error('Failed to authenticate with M-Pesa API');
    }
  }
  // Initiate M-Pesa STK Push
  async initiatePayment(userId: string, orderId: string, phoneNumber: string, amount: number) {
    const accessToken = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-T:Z.]/g, '').substring(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    try {
      const response = await axios.post(
        this.baseURL,
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.SERVER_URL}/payment/callback`,
          AccountReference: 'RestaurantOrder',
          TransactionDesc: `Payment for Order ${orderId}`,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return prisma.payment.create({
        data: {
          userId,
          orderId,
          amount,
          transactionId: response.data.CheckoutRequestID,
          status: 'pending',
        },
      });
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  // Handle M-Pesa Callback
  async handleCallback(response: any) {
    const { Body } = response;
    const resultCode = Body.stkCallback.ResultCode;
    const transactionId = Body.stkCallback.CheckoutRequestID;

    return prisma.payment.update({
      where: { transactionId },
      data: { status: resultCode === 0 ? 'completed' : 'failed' },
    });
  }

  // Cancel a Transaction (Reversal API)
  async cancelTransaction(transactionId: string, amount: number) {
    const accessToken = await this.getAccessToken();
    const initiatorPassword = Buffer.from(process.env.MPESA_PASSKEY!).toString('base64');

    try {
      const response = await axios.post(
        this.reversalURL,
        {
          Initiator: 'apiuser',
          SecurityCredential: initiatorPassword,
          CommandID: 'TransactionReversal',
          TransactionID: transactionId,
          Amount: amount,
          ReceiverParty: process.env.MPESA_SHORTCODE,
          RecieverIdentifierType: '4',
          ResultURL: `${process.env.SERVER_URL}/payment/reversal-callback`,
          QueueTimeOutURL: `${process.env.SERVER_URL}/payment/reversal-timeout`,
          Remarks: 'Transaction reversal request',
          Occasion: 'Customer Refund',
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return { message: 'Reversal request sent', response: response.data };
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      throw new Error('Failed to cancel transaction');
    }
  }

  // Get All Transactions
  async getAllTransactions() {
    return prisma.payment.findMany({
      include: { user: true, order: true },
    });
  }

  // Generate Receipt for a Specific Transaction
  async getTransactionReceipt(transactionId: string) {
    const transaction = await prisma.payment.findUnique({
      where: { transactionId },
      include: { user: true, order: true },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      receipt: {
        transactionId: transaction.transactionId,
        customer: transaction.user?.name,
        email: transaction.user?.email,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.createdAt,
      },
    };
  }
}
