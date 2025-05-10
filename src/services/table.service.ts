import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TableService {
  // Create a table
  async createTable(data: { name: string; capacity: number; description: string; image?: string }) {
    return prisma.table.create({ data });
  }

  // View all tables
  async getAllTables() {
    return prisma.table.findMany();
  }

  // Update table details
  async updateTable(tableId: string, data: Partial<{ name: string; capacity: number; description: string; image: string }>) {
    return prisma.table.update({
      where: { id: tableId },
      data,
    });
  }

  // Remove a table
  async deleteTable(tableId: string) {
    return prisma.table.delete({ where: { id: tableId } });
  }

  // View available tables
  async getAvailableTables() {
    return prisma.table.findMany({
      where: { status: 'available' },
    });
  }

  // Change the status of a table
  async changeTableStatus(tableId: string, status: 'available' | 'reserved') {
    const table = await prisma.table.findUnique({ where: { id: tableId } });

    if (!table) {
      throw new Error('Table not found');
    }

    return prisma.table.update({
      where: { id: tableId },
      data: { status },
    });
  }
}
