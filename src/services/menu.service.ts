import { PrismaClient } from '@prisma/client';
import { CreateMenuInput, UpdateMenuInput } from '../interface/menu.interface';

const prisma = new PrismaClient();

export class MenuService {
  // Create Menu Item
  async createMenuItem(data: CreateMenuInput) {
    return prisma.menu.create({ data });
  }

  // Get Menu Item by ID
  async getMenuItemById(id: string) {
    const menuItem = await prisma.menu.findUnique({ where: { id } });
    if (!menuItem) throw new Error('Menu item not found');
    return menuItem;
  }

  // Update Menu Item
  async updateMenuItem(id: string, data: UpdateMenuInput) {
    return prisma.menu.update({ where: { id }, data });
  }

  // Delete Menu Item
  async deleteMenuItem(id: string) {
    return prisma.menu.delete({ where: { id } });
  }

  // Get All Menu Items
  async getAllMenuItems() {
    return prisma.menu.findMany();
  }

  // ✅ Change Menu Item Status (Only for Managers)
  async changeMenuItemStatus(userId: string, menuId: string, newStatus: 'Available' | 'Unavailable') {
    // Check if the user is a manager
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'client') {
      throw new Error('Unauthorized: Only managers can change menu item status.');
    }

    return prisma.menu.update({
      where: { id: menuId },
      data: { status: newStatus },
    });
  }
}
