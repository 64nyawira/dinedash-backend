import { Request, Response } from 'express';
import { TableService } from '../services/table.service';

const tableService = new TableService();

export class TableController {
  async createTable(req: Request, res: Response) {
    try {
      const table = await tableService.createTable(req.body);
      res.status(201).json(table);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error creating table' });
    }
  }

  async getAllTables(req: Request, res: Response) {
    try {
      const tables = await tableService.getAllTables();
      res.status(200).json(tables);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching tables' });
    }
  }

  async updateTable(req: Request, res: Response) {
    try {
      const { tableId } = req.params;
      const table = await tableService.updateTable(tableId, req.body);
      res.status(200).json(table);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error updating table' });
    }
  }

  async deleteTable(req: Request, res: Response) {
    try {
      const { tableId } = req.params;
      const result = await tableService.deleteTable(tableId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error deleting table' });
    }
  }

  async getAvailableTables(req: Request, res: Response) {
    try {
      const tables = await tableService.getAvailableTables();
      res.status(200).json(tables);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching available tables' });
    }
  }

  async changeTableStatus(req: Request, res: Response) {
    try {
      const { tableId, status } = req.body;
      const table = await tableService.changeTableStatus(tableId, status);
      res.status(200).json(table);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error changing table status' });
    }
  }
}
