import { ResultSetHeader, RowDataPacket } from "mysql2/promise"; // Импортируем RowDataPacket
import getPool from "../../../db/connect_MySQL.js";
import bcrypt from "bcrypt";

// Интерфейс для входных данных логина
interface AuthData {
  email: string;
  password: string;
  name?: string;
}

// Интерфейс для данных пользователя из БД
interface User extends RowDataPacket {
  // Наследуем RowDataPacket
  id: number;
  name: string;
  password: string; // Хешированный пароль
}

// Интерфейс для успешного ответа
interface AuthSuccess {
  user: { id: number; name: string; email: string };
}

// Тип возвращаемого значения loginService
type AuthnResult = AuthSuccess | { error: string };

class AuthService {
  // Метод логина: проверяет учетные данные и возвращает токен
  async loginService(data: AuthData): Promise<AuthnResult> {
    try {
      const { email, password } = data;

      // Получаем пул соединений и выполняем запрос
      const pool = await getPool();
      const [rows] = await pool.query<User[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      // Проверяем, найден ли пользователь
      if (rows.length === 0) {
        return { error: "Invalid email or password" };
      }

      // Извлекаем данные пользователя
      const user = rows[0];

      // Проверяем совпадение пароля с хешем
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { error: "Invalid email or password" };
      }

      // Возвращаем данные пользователя
      return {
        user: { id: user._id, name: user.name, email: user.email },
      };
    } catch (error) {
      // Логируем ошибку и возвращаем её
      console.error("Error during login:", error);
      return { error: "Server error during login" };
    }
  }

  // Метод регистаруии User
  async signupService(data: AuthData): Promise<AuthnResult> {
    try {
      const { email, name, password } = data;

      // Получаем пул соединений и выполняем запрос
      const pool = await getPool();

      // Проверка на наличее User
      const [checkUser] = await pool.query<User[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (checkUser.length > 0) {
        return { error: "Such User exist" };
      }

      // Хешируем password
      const hashedPassword: string = await bcrypt.hash(password, 10);

      // Передаем данные в базу данных
      const sql = "INSERT INTO users (email, name, password) VALUE (?, ?, ?)";
      const [result] = await pool.query<ResultSetHeader>(sql, [
        email,
        name,
        hashedPassword,
      ]);

      // Возвращаем данные пользователя
      return {
        user: {
          id: result.insertId,
          email,
          name: name ?? "",
        },
      };
    } catch (err) {
      // Логируем ошибку и возвращаем её
      console.error("Error during sign:", err);
      return { error: "Server error during sign" };
    }
  }
}

// Экспортируем экземпляр класса
export default new AuthService();
