import express from "express";
import path from "path";
import { errorHandler } from "./server/middlewares/errorHandler";
import adminRouter from "./server/routes/adminRoutes";
import curriculumRouter from "./server/routes/curriculumRoutes";
import statusRouter from "./server/routes/statusRoutes";
import { trackRequest } from "./server/utils/statsStore";

const app = express();
const PORT = 3000;

// Enable CORS via custom headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Tambahkan setelah app.use("/api", statusRouter);
app.post("/api/debug-docx", async (req, res) => {
  try {
    // Test 1: Apakah import berhasil?
    const { generateDocx } = await import("./server/utils/docxUtils");
    res.json({ step: 1, ok: true, msg: "Import docxUtils berhasil" });
  } catch (err: any) {
    res.status(500).json({ step: 1, ok: false, error: err.message, stack: err.stack });
  }
});

app.post("/api/debug-docx-generate", async (req, res) => {
  try {
    const { generateDocx } = await import("./server/utils/docxUtils");
    // Test 2: Apakah generate dengan data minimal bisa?
    const buf = await generateDocx("cp", {
      identity: { subject: "Test", phase: "D", schoolName: "Test School" },
      tps: [],
      babs: [],
      elements: []
    });
    res.json({ step: 2, ok: true, size: buf.length });
  } catch (err: any) {
    res.status(500).json({ step: 2, ok: false, error: err.message, stack: err.stack });
  }
});

// Setup body parsing
app.use(express.json({ limit: "50mb" }));

// Increment request counter for metric diagnostics
app.use((req, res, next) => {
  trackRequest("request");
  next();
});

// Mount modular sub-routers
app.use("/api/admin", adminRouter);
app.use("/api/curriculum", curriculumRouter);
app.use("/api", statusRouter);

// Centralized error handling middleware (DRY principle)
app.use(errorHandler);

// Setup Vite development server & production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [Full-Stack Modular] Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
