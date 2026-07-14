import { Router } from "express";
import { analyzeCp, exportDocx, getCPData, computeKalender, getSubjectsForPhase } from "../controllers/curriculumController";

const router = Router();

// Define core curriculum workflows
router.post("/analyze-cp", analyzeCp);
router.post("/export-docx", exportDocx);
router.post("/get-cp", getCPData);
router.post("/compute-kalender", computeKalender);
router.post("/get-subjects", getSubjectsForPhase);

export default router;
