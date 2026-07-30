import express, { Application } from "express";
import cors from "cors";
import { config } from "./config";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { globalError } from "./middlewares/globalError";
import { categoryRoutes } from "./modules/category/category.route";
import { serviceRoutes } from "./modules/service/service.route";
import { technicianRoutes } from "./modules/technicianProfile/technicianProfile.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { reviewRoutes } from "./modules/review/review.route";

export const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials:true
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(globalError);