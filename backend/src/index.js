require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { authenticateToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Auth routes (we'll create these next)
app.use("/api/auth", require("./routes/auth"));

// Protected routes
app.use("/api/users", authenticateToken, require("./routes/users"));
app.use("/api/items", authenticateToken, require("./routes/items"));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
