import dotenv from "dotenv";
dotenv.config();

export interface Config {
  db: {
    mysql: {
      host?: string;
      user?: string;
      password?: string;
      database?: string;
    };
  };
  email: {
    user?: string;
    password?: string;
  };
  port?: string;
  secretKey?: string;
  jwtSecret?: string;
}

const config: Config = {
  db: {
    mysql: {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
    },
  },
  email: {
    user: process.env.MAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  port: process.env.PORT,
  secretKey: process.env.JWT_SECRET,
};

export default Object.freeze(config);
