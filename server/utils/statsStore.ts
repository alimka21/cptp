export interface ServerMetrics {
  totalRequests: number;
  cpAnalyses: number;
  docxExports: number;
  serverUpTime: number; // Startup timestamp
}

// In-memory persistent tracking store
export const serverMetrics: ServerMetrics = {
  totalRequests: 0,
  cpAnalyses: 0,
  docxExports: 0,
  serverUpTime: Date.now(),
};

// Generate some initial seed data for the 7-day graph so it's not empty on Vercel boot
export const analyticsHistory = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    views: Math.floor(Math.random() * 50) + 10,
    generations: Math.floor(Math.random() * 30) + 5,
  };
});

/**
 * Utility tracker to tick requests
 */
export function trackRequest(type: "request" | "analysis" | "export" | "view") {
  if (type === "request") {
    serverMetrics.totalRequests++;
  } else if (type === "analysis") {
    serverMetrics.cpAnalyses++;
    // Update today's generations
    const today = analyticsHistory[analyticsHistory.length - 1];
    if (today) today.generations++;
  } else if (type === "export") {
    serverMetrics.docxExports++;
  } else if (type === "view") {
    // Update today's views
    const today = analyticsHistory[analyticsHistory.length - 1];
    if (today) today.views++;
  }
}
