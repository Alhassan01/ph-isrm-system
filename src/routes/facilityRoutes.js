import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isNationalAdmin } from "../middlewares/roleMiddleware.js";
import { createFacility, deleteFacility, getFacilities, updateFacility } from "../controllers/facilityController.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.post("/", protect, isNationalAdmin, createFacility);
router.get("/", protect, isNationalAdmin, getFacilities);

router.use(protect);
//router.post("/", createFacility);
//router.put("/", updateFacility);
//router.delete("/", deleteFacility);
router.post("/", allowRoles("national_admin"), createFacility);
router.put("/:id", allowRoles("national_admin"), updateFacility);
router.delete("/:id", allowRoles("national_admin"), deleteFacility);

//Admin role
router.get("/facilities", protect, authorizeRoles("national_admin"), getFacilities);
// ✅ create and delete facilities
router.post("/facilities", protect, authorizeRoles("national_admin"), createFacility);
router.delete("/facilities/:id", protect, authorizeRoles("national_admin"), deleteFacility);


router.get("/", getFacilities);

export default router;