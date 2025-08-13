import express, { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router: Router = express.Router();

router.post("/login", AuthController.login);

router.post("/signup", AuthController.signup);

export default router;
