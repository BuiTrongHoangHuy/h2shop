import dotenv from 'dotenv';
import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Import database connection
import { testConnection } from './config/database';
import authRouter from "./modules/auth/routes/authRoutes";
import productRouter from "./modules/product/routes/productRoutes";
import cartRouter from "./modules/cart/routes/cartRoute";
import orderRouter from "./modules/order/routes/orderRoute";
import uploadRouter from "./modules/upload/uploadRoute";
import categoryRouter from "./modules/category/routes/categoryRoutes";
import paymentRouter from "./modules/payment/routes/paymentRoute";
import reviewRouter from "./modules/review/routes/reviewRoutes";
import discountRouter from "./modules/discount/routes/discountRoutes";
import recommendationRouter from "./modules/recommendation/routes/recommendationRoutes";

// Create Express app
const app: Application = express();

// Test database connection
testConnection();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/auth', authRouter());
app.use('/api/product', productRouter());
app.use('/api/cart', cartRouter());
app.use('/api/order', orderRouter());
app.use('/api/upload', uploadRouter());
app.use('/api/category', categoryRouter());
app.use('/api/payment', paymentRouter());
app.use('/api/review', reviewRouter());
app.use('/api/discount', discountRouter());
app.use('/api/recommendation', recommendationRouter());
// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
interface ErrorWithStatus extends Error {
  status?: number;
}

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;
