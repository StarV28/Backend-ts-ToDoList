import express from "express";
import getPool from "./db/connect_MySQL.js";
import routes from "./src/v1/routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import middleware from "./middleware/index.js";

const app = express();

// Connect DB MySQL
await getPool();
// Connect Middleware
middleware(app);
// Connect Routers
app.use("/api/v1", routes);
// Error handling middleware
errorHandler(app);

export default app;
