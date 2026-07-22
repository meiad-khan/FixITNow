import express, { Application } from "express";
import cors from "cors";
import { config } from "./config";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";

export const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);