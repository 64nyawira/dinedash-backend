import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  // Log an event (e.g., purchase, cart addition, view)
  async trackEvent(userId: string | null, orderId: string | null, action: string, details?: string) {
    return prisma.analytics.create({
      data: { userId, orderId, action, details },
    });
  }

  // Get all analytics logs
  async getAnalytics() {
    return prisma.analytics.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: true,
      },
    });
  }

  // Generate sales report based on completed transactions
  async getSalesReport() {
    return prisma.order.findMany({
      where: { status: 'completed' },
      include: {
        orderItems: { include: { menu: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
