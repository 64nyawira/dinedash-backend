// src/routes/menuRouter.ts

import { Router } from 'express';
import { MenuController } from '../controller/menu.controller';

const menuRouter = Router();
const menuController = new MenuController();

menuRouter.post('/create', menuController.createMenuItem);
menuRouter.get('/getone/:id', menuController.getMenuItemById);
menuRouter.put('/update/:id', menuController.updateMenuItem);
menuRouter.delete('/delete/:id', menuController.deleteMenuItem);
menuRouter.get('/all', menuController.getAllMenuItems);
menuRouter.put('/status/:menuId', menuController.changeMenuItemStatus);

export default menuRouter;
