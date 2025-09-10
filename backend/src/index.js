import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { authenticateToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/users.route.js";
import itemRoutes from "./routes/item.route.js";
import requisitionRoutes from "./routes/requisition.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/items", authenticateToken, itemRoutes);
app.use("/api/requisitions", authenticateToken, requisitionRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
