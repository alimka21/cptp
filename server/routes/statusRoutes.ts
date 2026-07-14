import { Router } from "express";
import { serverMetrics } from "../utils/statsStore";

const router = Router();

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
    metrics: {
      totalRequests: serverMetrics.totalRequests,
    },
  });
});

export default router;
