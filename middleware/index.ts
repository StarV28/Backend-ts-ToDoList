import express, { Express } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import logger from "morgan";
import cors from "cors";
import sessionConfig from "../config/session.js";
import auth from "./auth.js";
import flash from "connect-flash";

// Визначення поточного файлу і директорії
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const middleware = (app: Express): void => {
  // Middleware для CORS
  app.use(cors());

  // Middleware для аутентификации
  auth(app);

  // Middleware для логирования запросов
  app.use(logger("dev"));

  // Middleware для парсинга JSON
  app.use(express.json());

  // Middleware для парсинга URL-кодированных данных
  app.use(express.urlencoded({ extended: false }));

  // Middleware для парсинга cookies
  app.use(cookieParser());

  // Middleware для статических файлов из public
  app.use(express.static(path.join(__dirname, "../public")));

  // Middleware для статических файлов из uploads
  app.use(express.static(path.join(__dirname, "../uploads")));

  // Middleware для сессий (раскомментировать при необходимости)
  app.use(sessionConfig);

  // Middleware для flash-сообщений (раскомментировать при необходимости)
  app.use(flash());
};

export default middleware;
