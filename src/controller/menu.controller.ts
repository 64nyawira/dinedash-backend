// src/controllers/menuController.ts

import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service';

const menuService = new MenuService();

export class MenuController {
  async createMenuItem(req: Request, res: Response) {
    try {
      const menuItem = await menuService.createMenuItem(req.body);
      res.status(201).json(menuItem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  async getMenuItemById(req: Request, res: Response) {
    try {
      const menuItem = await menuService.getMenuItemById(req.params.id);
      res.status(200).json(menuItem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Menu item not found';
      res.status(404).json({ error: message });
    }
  }

  async updateMenuItem(req: Request, res: Response) {
    try {
      const menuItem = await menuService.updateMenuItem(req.params.id, req.body);
      res.status(200).json(menuItem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  async deleteMenuItem(req: Request, res: Response) {
    try {
      const menuItem = await menuService.deleteMenuItem(req.params.id);
      res.status(200).json(menuItem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Menu item not found';
      res.status(404).json({ error: message });
    }
  }

  async getAllMenuItems(req: Request, res: Response) {
    try {
      const menuItems = await menuService.getAllMenuItems();
      res.status(200).json(menuItems);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  // ✅ Change Menu Item Status
  async changeMenuItemStatus(req: Request, res: Response) {
    try {
      const { userId, newStatus } = req.body;
      const { menuId } = req.params;

      const menuItem = await menuService.changeMenuItemStatus(userId, menuId, newStatus);
      res.status(200).json({ message: 'Menu item status updated successfully', menuItem });
    } catch (error) {
      res.status(403).json({ error: error instanceof Error ? error.message : 'Unauthorized or invalid request' });
    }
  }

}
