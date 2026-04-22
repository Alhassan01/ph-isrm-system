import express from "express";
import { createIncident, updateIncidentStatus } from "../controllers/incidentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import Incident from "../models/incident.js";

const router = express.Router();

// GET all incidents
router.get("/", protect, async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.json({
      success: true,
      data: incidents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE incident
router.post("/", protect, createIncident);

// UPDATE status (FIXED)
router.put("/:id", protect, updateIncidentStatus);

export default router;
//<===============================================Initial Code============================================================>
// import express from "express";
// import { createIncident, updateIncidentStatus } from "../controllers/incidentController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import Incident from "../models/incident.js";

// const router = express.Router();

// //Get all incidents
// router.get("/", protect, async (req, res) => {
//     try{
//         const incidents = await Incident.find();
//         res.json({
//             success: true,
//             data: incidents
//         });
//     }catch(error){
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// //Create incident
// // Initial code, cause bug router.post("/incidents", protect, createIncident);
// router.post("/", protect, createIncident)
// //Update incident status
// router.put("/incidents/:id/status", protect, updateIncidentStatus);

// export default router;