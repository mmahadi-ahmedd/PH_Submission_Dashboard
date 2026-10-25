import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate, authorize } from "./middlewares/auth";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);

app.get("/api/test/student", authenticate, authorize("STUDENT"), (_req, res) => {
  res.json({ message: "Hello student" });
});
app.get("/api/test/mentor", authenticate, authorize("MENTOR"), (_req, res) => {
  res.json({ message: "Hello mentor" });
});

app.use(notFound);
app.use(errorHandler);

export default app;