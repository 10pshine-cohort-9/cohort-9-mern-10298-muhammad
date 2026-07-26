import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
export const logger = pino({ level: 'info' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Initialize Database and start server
const startServer = async () => {
  try {
    await initDb();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
