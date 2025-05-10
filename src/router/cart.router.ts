import { Router } from 'express';
import { CartController } from '../controller/cart.controller';
const cartRouter = Router();
const cartController = new CartController();

cartRouter.post('/add', cartController.addToCart);
cartRouter.post('/remove', cartController.removeFromCart);
cartRouter.get('/view/:userId', cartController.viewCart);
cartRouter.post('/clear', cartController.clearCart);

export default cartRouter;
