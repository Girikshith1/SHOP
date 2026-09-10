import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
} catch {
  // Ignore in bundled environment
}
dotenv.config();

const app = express();

// Ensure DB connection for every request
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[DB] Middleware connection error:', err);
  }
  next();
});

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
const healthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'DON Streetwear API',
    time: new Date().toISOString(),
    database: 'connected',
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API Router
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/collections', collectionRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/admin', adminRoutes);

// Mount router on /api, /, and direct routes to guarantee matching regardless of Vercel path rewriting
app.use('/api', apiRouter);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/collections', collectionRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/', apiRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

export default app;
