import express from "express";
//import createUser function from userController.js to handle the creation of a new user
import { createUser }  from "../controllers/userController.js";
import { getUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { isNationalAdmin } from "../middlewares/roleMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
//create an instance of the express router to define routes for user-related operations
const router = express.Router();

//create API endpoint 
router.post("/users", protect, isNationalAdmin, createUser)

router.get("/", protect, isNationalAdmin, getUsers)

//router.use(protect);
router.post("/users", protect, authorizeRoles("national_admin"), createUser);
router.get("/users", protect, authorizeRoles("national_admin"), getUsers);



// Only national_admin can manage users
router.post("/", allowRoles("national_admin"), createUser);
router.put("/:id", allowRoles("national_admin"), updateUser);
router.delete("/:id", allowRoles("national_admin"), deleteUser);

// ✅ ADD THESE
router.put("/users/:id", protect, authorizeRoles("national_admin"), updateUser);
router.delete("/users/:id", protect, authorizeRoles("national_admin"), deleteUser);


// Everyone authenticated can view
router.get("/", getUsers);
export default router;
