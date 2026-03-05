import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import prisma from "./lib/prisma";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import companyRoutes from "./routes/companies";
import serviceRoutes from "./routes/services";
import serviceRequestRoutes from "./routes/serviceRequests";
import projectRoutes from "./routes/projects";
import messageRoutes from "./routes/messages";
import dashboardRoutes from "./routes/dashboard";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "https://agency-hub-wheat.vercel.app/",
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
