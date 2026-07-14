import { Request, Response, NextFunction } from "express";
import { serverMetrics } from "../utils/statsStore";

/**
 * Handles admin login verification
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { pin } = req.body;
    const adminSecret = process.env.ADMIN_PIN || "kurikulummerdeka";

    if (!pin) {
      return res.status(400).json({
        success: false,
        error: "PIN Admin tidak boleh kosong."
      });
    }

    if (pin === adminSecret) {
      return res.json({
        success: true,
        message: "Otentikasi admin berhasil.",
        token: `sess_admin_${adminSecret}`,
        role: "admin",
      });
    }

    return res.status(401).json({
      success: false,
      error: "PIN Admin yang Anda masukkan salah.",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns protected server diagnostics & system status
 */
export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const memory = process.memoryUsage();
    const upTimeSeconds = Math.floor((Date.now() - serverMetrics.serverUpTime) / 1000);

    res.json({
      success: true,
      stats: {
        totalRequests: serverMetrics.totalRequests,
        cpAnalyses: serverMetrics.cpAnalyses,
        docxExports: serverMetrics.docxExports,
        upTimeSeconds,
        uptimeFormatted: `${Math.floor(upTimeSeconds / 60)}m ${upTimeSeconds % 60}s`,
        memoryUsageMB: {
          rss: Math.round(memory.rss / 1024 / 1024),
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        },
        nodeVersion: process.version,
        platform: process.platform,
        hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
        hasAdminConfigured: !!process.env.ADMIN_PIN,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Resets tracked in-memory server metrics
 */
export async function clearStats(req: Request, res: Response, next: NextFunction) {
  try {
    serverMetrics.totalRequests = 0;
    serverMetrics.cpAnalyses = 0;
    serverMetrics.docxExports = 0;

    res.json({
      success: true,
      message: "Cache statistik server berhasil dikosongkan.",
    });
  } catch (error) {
    next(error);
  }
}
