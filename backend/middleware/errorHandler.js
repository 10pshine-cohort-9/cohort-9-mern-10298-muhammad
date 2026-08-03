import { logger } from '../server.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : (err.message || 'Error occurred');

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
