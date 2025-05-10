import { Router } from 'express';
import { AuthController } from '../controller/userauth.controller';
const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/verify-reset-code', authController.verifyResetCode);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/change-role', authController.changeRole);
authRouter.get('/users', authController.getAllUsers);
authRouter.delete('/user', authController.deleteUser);


export default authRouter;
