import express from 'express';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from '@/middlewares/error.middleware';
import invoiceRoutes from './routes/invoice.routes';
import productRoutes from './routes/product.routes';

export const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

export default app;
