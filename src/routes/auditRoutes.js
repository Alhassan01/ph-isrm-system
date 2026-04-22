import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {isNationalAdmin, authorizeRoles} from "../middlewares/roleMiddleware.js";
import AuditLog from "../models/auditLog.js";
import { createUser } from "../controllers/userController.js";
import { createFacility } from "../controllers/facilityController.js";
import { getAuditLogs } from "../controllers/auditController.js";
import Incident from "../models/incident.js";

const router = express.Router();

router.post("/users", protect, isNationalAdmin, createUser);
//router.post("/facilities", protect, isNationalAdmin, createFacility);
// ✅ ONLY national_admin can view logs
router.get("/", protect, authorizeRoles("national_admin"), getAuditLogs);

router.get("/", protect, async (req, res) => {
  if (req.user.role !== "national_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  const logs = await AuditLog.find()
  .populate("incident")
  .populate("changeBy", "email role");


  res.json({
    success: true,
    data: logs
  });
});

export default router;