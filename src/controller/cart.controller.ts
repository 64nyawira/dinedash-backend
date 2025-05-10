import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
const cartService = new CartService();

export class CartController {
  async addToCart(req: Request, res: Response) {
    try {
      const { userId, menuId, quantity } = req.body;
      const result = await cartService.addToCart(userId, menuId, quantity);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const { userId, menuId } = req.body;
      const result = await cartService.removeFromCart(userId, menuId);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async viewCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await cartService.viewCart(userId);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const result = await cartService.clearCart(userId);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }
}
