import express from "express";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db";
import { createExpiredTodosCronJob } from "./cronJobs/expiredTodos";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import * as swaggerDocument from "./swagger/swagger.json";

const app = express();

app.use(express.json());

connectDB();

createExpiredTodosCronJob();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument), () => {
  console.log("swagger");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

export default app;
