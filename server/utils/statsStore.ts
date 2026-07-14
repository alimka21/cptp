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

/**
 * Utility tracker to tick requests
 */
export function trackRequest(type: "request" | "analysis" | "export") {
  serverMetrics.totalRequests++;
  if (type === "analysis") {
    serverMetrics.cpAnalyses++;
  } else if (type === "export") {
    serverMetrics.docxExports++;
  }
}
