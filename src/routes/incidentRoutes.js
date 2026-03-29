import express from "express";
import { createIncident, updateIncidentStatus } from "../controllers/incidentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/incidents", protect, createIncident);

router.put("/incidents/:id/status", protect, updateIncidentStatus);

export default router;