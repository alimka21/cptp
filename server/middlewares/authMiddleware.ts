import { Request, Response, NextFunction } from "express";

/**
 * Access middleware to protect admin endpoints.
 * It checks the 'Authorization' header for a valid Bearer token.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_PIN || "kurikulummerdeka";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Akses ditolak. Token otentikasi admin diperlukan untuk mengakses modul ini.",
    });
  }

  const token = authHeader.split(" ")[1];

  // Accept either the raw admin PIN (simplified) or a session token derived from it
  if (token === adminSecret || token === `sess_admin_${adminSecret}`) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: "Sesi otentikasi admin tidak cocok atau sudah kadaluarsa.",
  });
}
