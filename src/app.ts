import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import submissionRoutes from "./modules/submissions/submission.routes";
import { authLimiter } from "./middlewares/rateLimiter";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import mentorRoutes from "./modules/mentor/mentor.routes";

const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/mentor", mentorRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;