import { Request, Response } from "express";
import TasksService from "../modules/TasksService.js";

//========================================================================================================================================================

class TaskController {
  //========================================================================================================================================================

  async createTask(req: Request, res: Response) {
    try {
      const result = await TasksService.create("tasks", req.body);
      res.status(200).json({ task: result });
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  }
  //========================================================================================================================================================
  async getTaskById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await TasksService.getByID("tasks", "_id", id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  }
  //========================================================================================================================================================
  async getListTasksUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string | null;
      const result = await TasksService.getListTasksByIdUser(id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  }
  //========================================================================================================================================================
  async updateTask(req: Request, res: Response) {
    try {
      const _id = req.body._id;
      const data = req.body;
      const result = await TasksService.update("tasks", "_id", _id, data);
      console.log("res update", result);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  }
  //========================================================================================================================================================
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string | number;
      const result = await TasksService.deleteById("tasks", "_id", id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  }
}

export default new TaskController();
