import express from "express";
import mongoose from "mongoose";
import "express-async-errors";
import "dotenv/config";
import http from "node:http";
import appRoutes from "./routes/index.js";
import { CustomError } from "./helpers/error-handler.js";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1", appRoutes);

app.all("*", (req, res) => {
  return res.status(404).json({
    statusCode: 404,
    message: `${req.originalUrl} not found`,
  });
});

// custom error handling
app.use((error, _req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json(error.serializeErrors());
  }
  next();
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log("Server is listening on port 4000");
});
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB connection established"))
  .catch((error) => console.log(error.messag));
