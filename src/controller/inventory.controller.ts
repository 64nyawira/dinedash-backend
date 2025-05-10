import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  async getInventory(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.getInventory();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching inventory' });
    }
  }

  async getLowStockItems(req: Request, res: Response) {
    try {
      const lowStock = await inventoryService.getLowStockItems();
      res.status(200).json(lowStock);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching low stock items' });
    }
  }
}
