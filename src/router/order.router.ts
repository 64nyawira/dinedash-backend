import { Router } from 'express';
import { OrderController } from '../controller/order.controller';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post('/place', orderController.placeOrder);
orderRouter.post('/cancel', orderController.cancelOrder);
orderRouter.get('/view/:userId', orderController.viewOrders);
orderRouter.get('/all', orderController.getAllOrders); // New route
orderRouter.post('/update-status', orderController.updateOrderStatus); 
orderRouter.post('/totalAmount', orderController.calculateTotalAmount); // Changed from GET to POST since it accepts request body

export default orderRouter;
