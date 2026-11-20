import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import allergyRoutes from "./routes/allergyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkerRoutes from "./routes/checkerRoutes.js";
import foodProductRoutes from "./routes/foodProductRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "Allergy Advisor API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/allergies", allergyRoutes);
app.use("/api/foods", foodProductRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/checker", checkerRoutes);
app.use("/api/weather", weatherRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
