import { createRequire } from "module";
import config from "./index.js";

// Используем require для CommonJS-совместимости
const require = createRequire(import.meta.url);
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// Создаем хранилище сессий в MySQL
const sessionStore = new MySQLStore({
  host: config.db.mysql.host,
  user: config.db.mysql.user,
  password: config.db.mysql.password,
  database: config.db.mysql.database,
  clearExpired: true,
  expiration: 86400000, // 1 день
});

// Настройка сессий
const sessionConfig = session({
  secret: config.secretKey ?? "default-secret",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 день
});

export default sessionConfig;
