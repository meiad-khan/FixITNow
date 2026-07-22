import express, { Application } from "express";
import cors from "cors";
import { config } from "./config";
import cookieParser from "cookie-parser";

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