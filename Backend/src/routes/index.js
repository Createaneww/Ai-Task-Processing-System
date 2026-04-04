import express from "express";
import authRoutes from "./auth.js";
import taskRoutes from "./tasks.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

export default router;
