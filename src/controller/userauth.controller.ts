import { Request, Response } from 'express';
import { AuthService } from '../services/userauth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body);
      res.status(200).json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const message = await authService.forgotPassword(req.body);
      res.status(200).json(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async verifyResetCode(req: Request, res: Response) {
    try {
      const message = await authService.verifyResetCode(req.body);
      res.status(200).json(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const message = await authService.resetPassword(req.body);
      res.status(200).json(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async changeRole(req: Request, res: Response) {
    try {
      const { adminId, userId, newRole } = req.body;
      const updatedUser = await authService.changeRole(adminId, userId, newRole);
      res.status(200).json(updatedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }
  
  async deleteUser(req: Request, res: Response) {
    try {
      const { adminId, userId } = req.body;
      const message = await authService.deleteUser(adminId, userId);
      res.status(200).json(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }
  
  
}
