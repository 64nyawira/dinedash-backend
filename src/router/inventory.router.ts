import { Router } from 'express';
import { InventoryController } from '../controller/inventory.controller';

const inventoryRouter = Router();
const inventoryController = new InventoryController();

inventoryRouter.get('/all', inventoryController.getInventory);
inventoryRouter.get('/low-stock', inventoryController.getLowStockItems);

export default inventoryRouter;
