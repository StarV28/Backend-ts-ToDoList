import { Request, Response } from "express";
import AuthService from "../modules/AuthService.js";
import { prepareToken } from "../../../utils/jwtHelpers.js";

// Интерфейс для ответа логина
interface AuthResponse {
  token: string;
  user: { id: string; name: string };
}

// Интерфейс для входных данных логина
interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

class AuthController {
  // Метод логина: обрабатывает POST-запрос на /auth/login
  async login(
    req: Request<object, AuthResponse, AuthRequest>,
    res: Response
  ): Promise<void> {
    try {
      // Проверяем наличие email и password в теле запроса
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Вызываем сервис логина (с await, так как метод асинхронный)
      const result = await AuthService.loginService({ email, password });

      // Проверяем, вернул ли сервис ошибку
      if ("error" in result) {
        res.status(401).json({ error: result.error });
        return;
      }

      const token = prepareToken({ id: result.user.id }, req.headers);

      // Отправляем успешный ответ с токеном и данными пользователя
      res.status(200).json({
        token,
        user: result.user,
      });
    } catch (err) {
      // Обработка неожиданных серверных ошибок
      res.status(500).json({ message: "Server error", err });
    }
  }

  async signup(
    req: Request<object, AuthResponse, AuthRequest>,
    res: Response
  ): Promise<void> {
    try {
      // Проверяем наличие email name password в теле запроса
      const { email, name, password } = req.body;
      if (!email || !password || !name) {
        res.status(400).json({ error: "Email or Password  are required" });
      }

      // Вызываем сервис sign (с await, так как метод асинхронный)
      const result = await AuthService.signupService({ email, name, password });

      // Проверяем, вернул ли сервис ошибку
      if ("error" in result) {
        res.status(401).json({ error: result.error });
        return;
      }

      // Создаем token
      const token = prepareToken({ id: result.user.id }, req.headers);

      // Отправляем успешный ответ с токеном и данными пользователя
      res.status(200).json({
        token,
        user: result.user,
      });
    } catch (err) {
      // Обработка неожиданных серверных ошибок
      res.status(500).json({ message: "Server error", err });
    }
  }
}

// Экспортируем экземпляр класса для использования в роутах
export default new AuthController();
