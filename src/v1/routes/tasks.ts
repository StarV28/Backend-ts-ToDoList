import express, { Router } from "express";
import TaskController from "../controllers/TaskController.js";

const router: Router = express.Router();

router.post("/create", TaskController.createTask);

router.get("/list/:id", TaskController.getListTasksUser);

router.get("/task/:id", TaskController.getTaskById);

router.post("/edit", TaskController.updateTask);

router.delete("/:id", TaskController.deleteTask);

export default router;
