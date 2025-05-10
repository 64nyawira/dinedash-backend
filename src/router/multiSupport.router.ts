import { Router } from 'express';
import { MultiSupportController } from '../controller/multiSupport';

const multiRouter = Router();
const multiSupportController = new MultiSupportController();
multiRouter.post('/convert-currency', multiSupportController.convertCurrency);
multiRouter.post('/translate', multiSupportController.translateInterface);

export default multiRouter;
