import { PrismaClient } from '@prisma/client';
import { LoyaltyService } from './loyalty.service';
import { AnalyticsService } from './analytics.service';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const loyaltyService = new LoyaltyService();
const analyticsService = new AnalyticsService();

export class OrderService {
  private transporter;

  constructor() {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify SMTP configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP configuration error:', error);
      } else {
        console.log('SMTP configuration successful');
      }
    });
  }

  async placeOrder(userId: string, orderType: 'dine-in' | 'take-away' | 'delivery') {
    // Reduce work inside the transaction
    const cartItems = await prisma.cart.findMany({ where: { userId } });
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }
    
    return prisma.$transaction(async (tx) => {
     
      const order = await tx.order.create({
        data: {
          userId,
          orderType,
          orderItems: {
            create: cartItems.map((item) => ({
              menuId: item.menuId,
              quantity: item.quantity,
            })),
          },
        },
      });
      await tx.cart.deleteMany({ where: { userId } });
      
      return order;
    }, {
      
      timeout: 10000 
    });
  }

  async cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order || order.status !== 'pending') {
      throw new Error('Order cannot be cancelled');
    }
    
    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });
  }

  async getOrdersByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { menu: true } },
      },
    });
  }

  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { menu: true } },
      },
    });
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled') {
    // Perform analytics and loyalty points tracking separately from the order status update
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        user: true, 
        orderItems: {
          include: { menu: true }
        } 
      },
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Run loyalty points and analytics as a separate process
    if (status === 'completed') {
      this.processCompletedOrderAsync(order);
    }
    
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  private async processCompletedOrderAsync(order: any) {
    try {
      const totalAmount = await this.calculateOrderTotal(order.id);
      console.log(`Order ${order.id} completed. Total: $${totalAmount}`);
      
      // Run these operations asynchronously to avoid blocking
      await Promise.all([
        analyticsService.trackEvent(
          order.userId,
          order.id,
          'purchase',
          `Completed order with total $${totalAmount}`
        ),
        loyaltyService.addPoints(order.userId, totalAmount),
        this.sendOrderCompletionEmail(order, totalAmount)
      ]);
      
      console.log(`Order ${order.id} post-processing completed`);
    } catch (error: unknown) {
      console.error(`Error processing completed order:`, error);
    }
  }

  private async sendOrderCompletionEmail(order: any, totalAmount: number) {
    try {
      if (!order.user || !order.user.email) {
        console.error('Cannot send email: User or email not found');
        return;
      }

      const itemsList = order.orderItems.map((item: any) => 
        `${item.quantity}x ${item.menu.name} - $${(item.menu.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const emailBody = `
        Dear ${order.user.name},

        Great news! Your order #${order.id} has been completed.

        Order Details:
        ${itemsList}

        Total Amount: $${totalAmount.toFixed(2)}
        Order Type: ${order.orderType}
        Date: ${new Date().toLocaleString()}

        Thank you for your order. We hope you enjoy your meal!

        Best regards,
        The DineDash Team
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: order.user.email,
        subject: `Your Order #${order.id} is Complete!`,
        text: emailBody,
      });

      console.log(`Order completion email sent to ${order.user.email}`);
    } catch (error) {
      console.error('Error sending order completion email:', error);
    }
  }
    
  async calculateOrderTotal(orderId: string): Promise<number> {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
      include: { menu: true },
    });
    
    return orderItems.reduce((sum, item) => sum + (item.menu?.price || 0) * item.quantity, 0);
  }
}