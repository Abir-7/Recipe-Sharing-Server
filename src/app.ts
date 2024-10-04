import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/utils/notFound";
import router from "./app/router";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:3000"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/", router);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(notFound);
app.use(globalErrorHandler);

export default app;
