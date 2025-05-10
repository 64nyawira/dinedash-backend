import { Router } from 'express';
import { ReservationController } from '../controller/reservation.controller';

const reservationRouter = Router();
const reservationController = new ReservationController();

reservationRouter.post('/make', reservationController.makeReservation);
reservationRouter.post('/cancel', reservationController.cancelReservation);
reservationRouter.get('/user/:userId', reservationController.getUserReservations);
reservationRouter.get('/all', reservationController.getAllReservations); // New route

export default reservationRouter;
