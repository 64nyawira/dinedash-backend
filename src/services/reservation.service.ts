import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export class ReservationService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async makeReservation(userId: string, tableId: string, reservationTime: Date) {
    const table = await prisma.table.findUnique({ where: { id: tableId } });

    if (!table || table.status !== 'available') {
      throw new Error('Table is not available for reservation');
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        tableId,
        reservationTime,
      },
    });

    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'reserved' },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await this.transporter.sendMail({
        from: `"Restaurant Reservations" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Reservation Confirmation',
        text: `Your reservation for table "${table.name}" on ${reservationTime} has been confirmed.`,
      });
    }

    return reservation;
  }

  async cancelReservation(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { table: true },
    });

    if (!reservation || reservation.status !== 'active') {
      throw new Error('Reservation cannot be cancelled');
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'cancelled' },
    });

    await prisma.table.update({
      where: { id: reservation.tableId },
      data: { status: 'available' },
    });

    return { message: 'Reservation cancelled successfully' };
  }

  async getUserReservations(userId: string) {
    return prisma.reservation.findMany({
      where: { userId },
      include: { table: true },
    });
  }

  // New: Get all reservations
  async getAllReservations() {
    return prisma.reservation.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        table: {
          select: { id: true, name: true, capacity: true, description: true },
        },
      },
    });
  }
}