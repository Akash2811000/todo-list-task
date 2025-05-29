import express from "express";
import connectDB from "./config/db";

const app = express();

app.use(express.json());
connectDB();
app.get("/", (_, res) => {
  res.send("TODO LIST");
});

export default app;
