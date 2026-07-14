import { Request, Response, NextFunction } from "express";

/**
 * Standard API error structure.
 */
export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Centralized error-handling middleware.
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan internal pada server.";

  console.error(`💥 [Error ${statusCode}] on custom backend:`, err);

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
}
