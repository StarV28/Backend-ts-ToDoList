import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
import { IncomingHttpHeaders } from "http";
// dotenv.config();
import config from "../config/index.js";

// Проверяем наличие JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// Час дії токена
const expiresIn: string = "60m";

// Секретний ключ для токена
// const tokenKey: string = process.env.JWT_SECRET;
const tokenKey: string | undefined = config.secretKey;

// Інтерфейс для заголовків
interface Headers {
  "user-agent"?: string;
  "accept-language"?: string;
  [key: string]: string | undefined;
}

// Інтерфейс для декодованого токена
interface DecodedToken {
  [key: string]: unknown;
}

// Функція для парсингу Bearer токена та декодування користувача
export function parseBearer(bearer: string, headers: Headers): DecodedToken {
  let token: string | undefined;
  if (bearer.startsWith("Bearer ")) {
    token = bearer.slice(7);
  }

  try {
    const decoded = jwt.verify(
      token || "",
      prepareSecret(headers)
    ) as DecodedToken;

    return decoded;
  } catch {
    throw new Error("Invalid token");
  }
}

// Функція для створення JWT токена
export function prepareToken(
  data: object,
  headers: IncomingHttpHeaders
): string {
  return jwt.sign(data, prepareSecret(headers), {
    expiresIn,
  } as jwt.SignOptions);
}

function prepareSecret(headers: IncomingHttpHeaders): string {
  const userAgent = Array.isArray(headers["user-agent"])
    ? headers["user-agent"].join(",")
    : headers["user-agent"] || "";
  const acceptLanguage = Array.isArray(headers["accept-language"])
    ? headers["accept-language"].join(",")
    : headers["accept-language"] || "";
  return tokenKey + userAgent + acceptLanguage;
}
