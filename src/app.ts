import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger/swagger.json";
const app = express();

app.use(express.json());
connectDB();
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument), () => {
  console.log("swagger");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (_, res) => {
  res.send("TODO LIST");
});

export default app;
