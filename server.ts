import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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

startServer();
