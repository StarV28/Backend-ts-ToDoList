import express, { Router } from "express";
import mainRouter from "./main.js";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import tasksRouter from "./tasks.js";

const router: Router = express.Router();

// change 'use' bi get/post/put/delete
router.use("/", mainRouter);

router.use("/user", userRouter);

router.use("/auth", authRouter);

router.use("/tasks", tasksRouter);

export default router;
