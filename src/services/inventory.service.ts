import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InventoryService {
  // Add a new inventory item
  async addInventory(menuId: string, stock: number, threshold: number) {
    return prisma.inventory.create({
      data: { menuId, stock, threshold },
    });
  }

  // Reduce stock after an order
  async updateStock(menuId: string, quantitySold: number) {
    const inventory = await prisma.inventory.findUnique({ where: { menuId } });

    if (!inventory) {
      throw new Error('Inventory item not found');
    }

    if (inventory.stock < quantitySold) {
      throw new Error('Not enough stock available');
    }

    return prisma.inventory.update({
      where: { menuId },
      data: { stock: { decrement: quantitySold } },
    });
  }

  // Get current inventory levels
  async getInventory() {
    return prisma.inventory.findMany({
      include: { menu: true },
    });
  }

  // Check items that need restocking
  async getLowStockItems() {
    return prisma.inventory.findMany({
      where: { stock: { lt: prisma.inventory.fields.threshold } },
      include: { menu: true },
    });
  }
}
