import { Router } from 'express';
import { PaymentController } from '../controller/payment.controller';

const paymentRouter = Router();
const paymentController = new PaymentController();

paymentRouter.post('/initiate', paymentController.initiatePayment);
paymentRouter.post('/callback', paymentController.handleCallback);
paymentRouter.post('/cancel', paymentController.cancelTransaction);
paymentRouter.get('/all', paymentController.getAllTransactions);
paymentRouter.get('/receipt/:transactionId', paymentController.getTransactionReceipt);

export default paymentRouter;
