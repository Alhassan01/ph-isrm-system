import express from "express";
import authRoutes from "./authRoutes.js";
import incidentRoutes from "./incidentRoutes.js";
import userRoutes from "./userRoutes.js";
import facilityRoutes from "./facilityRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/incidents", incidentRoutes);
router.use("/users", userRoutes);
router.use("/facilities", facilityRoutes);

export default router;