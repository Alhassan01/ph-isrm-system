// import express from 'express';
// import dotenv from "dotenv";
// import connectDB from "./src/config/db.js";
// import userRoutes from "./src/routes/userRoutes.js";
// import authRoutes from "./src/routes/authRoutes.js";
// import { protect } from './src/middlewares/authMiddleware.js';
// import { authorizeRoles } from './src/middlewares/roleMiddleware.js';  
// import taskRoutes from "./src/routes/taskRoutes.js";
// import incidentRoutes from "./src/routes/incidentRoutes.js";
// import cors from "cors";
// import auditRoutes from "./src/routes/auditRoutes.js";
// import facilityRoutes from "./src/routes/facilityRoutes.js";
import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from './middlewares/authMiddleware.js';
import { authorizeRoles } from './middlewares/roleMiddleware.js';  
import taskRoutes from "./routes/taskRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import cors from "cors";
import auditRoutes from "./routes/auditRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";





dotenv.config();

//connect databasse
connectDB();

const app = express();

//for frontend development, allow CORS from localhost:3000
// app.use(cors({
//   origin: "http://localhost:5173"
// }));
app.use(cors({
  origin: "*"
}));
app.use(express.json());
//user routes
app.use("/api", userRoutes);
//authentication routes
app.use("/api/auth", authRoutes);

//Task routes
app.use("/api", taskRoutes);

// Incident routes
app.use("/api/incidents", incidentRoutes);


//Protected route 
app.get("/api/protected", protect, (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});
//audit route
app.use("/api/audit-Logs", auditRoutes);

//facility routes
app.use("/api", facilityRoutes)

//Admin-only route. Protect route and check for admin role
app.get("/api/admin", protect, authorizeRoles("national_admin"), (req, res) =>{
    res.json({
        success: true,
        message: "Welcome Admin!",
        user: req.user
    });
}
);
app.get("/", (req, res) => {
    res.send("PH-ISRM API is  runnning... ");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}`)
})