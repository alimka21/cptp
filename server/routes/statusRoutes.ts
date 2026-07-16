import { Router } from "express";
import { serverMetrics, analyticsHistory, trackRequest } from "../utils/statsStore";

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

router.get("/analytics", (req, res) => {
  res.json({
    success: true,
    history: analyticsHistory,
    totals: {
      views: analyticsHistory.reduce((acc, curr) => acc + curr.views, 0),
      generations: serverMetrics.cpAnalyses + analyticsHistory.reduce((acc, curr) => acc + curr.generations, 0),
    }
  });
});

router.post("/analytics/view", (req, res) => {
  trackRequest("view");
  res.json({ success: true });
});

export default router;
