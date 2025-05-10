import { Request, Response } from 'express';
import { ReservationService } from '../services/reservation.service';

const reservationService = new ReservationService();

export class ReservationController {
  async makeReservation(req: Request, res: Response) {
    try {
      const { userId, tableId, reservationTime } = req.body;
      const reservation = await reservationService.makeReservation(userId, tableId, new Date(reservationTime));
      res.status(201).json(reservation);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async cancelReservation(req: Request, res: Response) {
    try {
      const { reservationId } = req.body;
      const result = await reservationService.cancelReservation(reservationId);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  async getUserReservations(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const reservations = await reservationService.getUserReservations(userId);
      res.status(200).json(reservations);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }

  // New: Get all reservations
  async getAllReservations(req: Request, res: Response) {
    try {
      const reservations = await reservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ error: message });
    }
  }
}