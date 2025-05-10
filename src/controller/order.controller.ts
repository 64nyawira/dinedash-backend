import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export class OrderController {
  async placeOrder(req: Request, res: Response) {
    try {
      const { userId, orderType } = req.body;
      const order = await orderService.placeOrder(userId, orderType);
      res.status(201).json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const order = await orderService.cancelOrder(orderId);
      res.status(200).json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async viewOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await orderService.getOrdersByUser(userId);
      res.status(200).json(orders);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }
  
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId, status } = req.body;
      const order = await orderService.updateOrderStatus(orderId, status);
      
      // Add more detailed success response for completed orders
      if (status === 'completed') {
        res.status(200).json({
          order,
          message: 'Order status updated to completed. Email notification sent to customer.'
        });
      } else {
        res.status(200).json(order);
      }
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error updating order status' });
    }
  }
  
  async calculateTotalAmount(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const totalAmount = await orderService.calculateOrderTotal(orderId);
      res.status(200).json({ orderId, totalAmount });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error calculating order total' });
    }
  }
}