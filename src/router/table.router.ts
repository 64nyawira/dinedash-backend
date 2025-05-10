import { Router } from 'express';
import { TableController } from '../controller/table.controller';

const tableRouter = Router();
const tableController = new TableController();

tableRouter.post('/create', tableController.createTable);
tableRouter.get('/all', tableController.getAllTables);
tableRouter.put('/update/:tableId', tableController.updateTable);
tableRouter.delete('/delete/:tableId', tableController.deleteTable);
tableRouter.get('/available', tableController.getAvailableTables);
tableRouter.post('/change-status', tableController.changeTableStatus); // New route

export default tableRouter;
