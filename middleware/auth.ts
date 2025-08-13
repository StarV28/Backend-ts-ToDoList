import { Request, Response, NextFunction, Express } from "express";
import { parseBearer } from "../utils/jwtHelpers.js";

// Интерфейс для расширения Request
interface AuthRequest extends Request {
  user?: unknown; // Уточните, если известна структура токена
}

const auth = (app: Express): void => {
  // Middleware для CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
  });

  // Middleware для аутентификации
  app.use((req: AuthRequest, res: Response, next: NextFunction) => {
    const openPaths: string[] = [
      "/api/v1/mains",
      "/api/v1/auth/login",
      "/api/v1/auth/signup",
    ];

    if (!openPaths.includes(req.path)) {
      try {
        if (!req.headers.authorization) {
          return res.status(401).json({
            result: "Access Denied: No Authorization header provided",
          });
        }

        // Приведение req.headers к типу Headers
        const headers: { [key: string]: string | undefined } = {};
        for (const [key, value] of Object.entries(req.headers)) {
          headers[key] = Array.isArray(value) ? value[0] : value;
        }

        req.user = parseBearer(req.headers.authorization, headers);
      } catch (err: unknown) {
        return res.status(401).json({
          result: "Access Denied: Invalid token",
          error: err instanceof Error ? err.message : "Unknown error ;((",
        });
      }
    }
    next();
  });
};

export default auth;
