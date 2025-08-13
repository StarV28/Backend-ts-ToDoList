// import { createPool, Pool } from "mysql2/promise";
// import config from "../config/index.js";

// // Интерфейс для конфигурации базы данных
// interface MySQLConfig {
//   host: string;
//   user: string;
//   password: string;
//   database: string;
// }

// // Проверка конфигурации
// const mysqlConfig: MySQLConfig = {
//   host: config.db.mysql.host || "localhost",
//   user: config.db.mysql.user || "root",
//   password: config.db.mysql.password || "",
//   database: config.db.mysql.database || "mydb",
// };

// // Функция для подключения к MySQL
// async function connectToMySQL(): Promise<Pool> {
//   try {
//     const pool = await createPool({
//       host: mysqlConfig.host,
//       user: mysqlConfig.user,
//       password: mysqlConfig.password,
//       database: mysqlConfig.database,
//     });
//     console.log(
//       `Successful connection to the database ${mysqlConfig.database}`
//     );
//     return pool;
//   } catch (err) {
//     console.error("Error connection to the MySQL:", err);
//     throw err; // Бросаем ошибку для обработки в вызывающем коде
//   }
// }

// Экспортируем функцию для получения пула
// export default async function getPool(): Promise<Pool> {
//   return await connectToMySQL();
// }

import { createPool, Pool } from "mysql2/promise";
import config from "../config/index.js";

interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

const mysqlConfig: MySQLConfig = {
  host: config.db.mysql.host || "localhost",
  user: config.db.mysql.user || "root",
  password: config.db.mysql.password || "",
  database: config.db.mysql.database || "mydb",
};

let pool: Pool | null = null;

export default function getPool(): Pool {
  if (!pool) {
    pool = createPool({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      waitForConnections: true,
      connectionLimit: 3, // <= не превышаем лимит Clever Cloud
      queueLimit: 0,
    });
    console.log(
      `Successful connection to the database ${mysqlConfig.database}`
    );
  }
  return pool;
}
