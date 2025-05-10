import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class CartService {
  async addToCart(userId: string, menuId: string, quantity: number = 1) {
    try {
      const existingItem = await prisma.cart.findFirst({
        where: { userId, menuId },
      });
      if (existingItem) {
        return prisma.cart.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });}
      return prisma.cart.create({
        data: { userId, menuId, quantity },
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add to cart');}}
  async removeFromCart(userId: string, menuId: string) {
    const existingItem = await prisma.cart.findFirst({
      where: { userId, menuId },
    });
  if (!existingItem) {
      throw new Error('Item not found in cart');
    }
 return prisma.cart.delete({ where: { id: existingItem.id } });
  }
  async viewCart(userId: string) {
    return prisma.cart.findMany({
      where: { userId },
      include: { menu: true },
    });}
  async clearCart(userId: string) {
    return prisma.cart.deleteMany({ where: { userId } });
  }}

