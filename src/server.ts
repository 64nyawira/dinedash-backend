import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import menuRouter from './router/menu.router';
import authRouter from './router/userauth.router';
import cartRouter from './router/cart.router';
import orderRouter from './router/order.router';
import tableRouter from './router/table.router';
import reservationRouter from './router/reservation.router';
import rewardRouter from './router/reward.router';
import loyaltyRouter from './router/loyalty.router';
import analyticRouter from './router/analytics.router';
import inventoryRouter from './router/inventory.router';
import multiRouter from './router/multiSupport.router';
import paymentRouter from './router/payment.router';
import uploadRouter from './router/upload.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'singular-daffodil-cc2224.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API routes
app.use("/menu", menuRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter); // This should handle file uploads at /upload endpoint
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/table", tableRouter);
app.use("/reservation", reservationRouter);
app.use("/reward", rewardRouter);
app.use("/loyalty", loyaltyRouter);
app.use("/analytics", analyticRouter);
app.use("/inventory", inventoryRouter);
app.use("/multiSupport", multiRouter);
app.use("/payment", paymentRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});