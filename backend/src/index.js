import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { authenticateToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/users.route.js";
import itemRoutes from "./routes/item.route.js";
import requisitionRoutes from "./routes/requisition.route.js";
import serviceRequestRoutes from "./routes/serviceRequest.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import transactionRoutes from "./routes/transactions.route.js";
import reportRoutes from "./routes/report.route.js";
import { startScheduledTasks } from "./services/scheduler.js";
import healthRoutes from "./routes/health.route.js";
import departmentRoute from "./routes/department.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: "Too many login attempts, please try again later.",
  },
  skipSuccessfulRequests: true,
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/items", authenticateToken, itemRoutes);
app.use("/api/requisitions", authenticateToken, requisitionRoutes);
app.use("/api/service-requests", authenticateToken, serviceRequestRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);
app.use("/api/transactions", authenticateToken, transactionRoutes);
app.use("/api/reports", authenticateToken, reportRoutes);
app.use("/api/departments", authenticateToken, departmentRoute);
app.use("/api/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// startScheduledTasks();
