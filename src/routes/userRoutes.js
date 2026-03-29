import express from "express";
//import createUser function from userController.js to handle the creation of a new user
import { createUser }  from "../controllers/userController.js";

//create an instance of the express router to define routes for user-related operations
const router = express.Router();

//create API endpoint 
router.post("/users", createUser)

export default router;
