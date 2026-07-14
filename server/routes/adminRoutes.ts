import { Router } from "express";
import { login, getStats, clearStats } from "../controllers/adminController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Public login endpoint
router.post("/login", login);

// Protected diagnostic endpoints
router.get("/stats", authMiddleware, getStats);
router.post("/clear-cache", authMiddleware, clearStats);

export default router;
