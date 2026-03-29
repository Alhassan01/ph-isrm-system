import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Task routes 
router.post("/tasks", protect, createTask)

//get tasks route
router.get("/tasks", protect, getTasks)

//update task route
router.put("/tasks/:id", protect, updateTask)

//delete task route
router.delete("/tasks/:id", protect, deleteTask);

export default router;