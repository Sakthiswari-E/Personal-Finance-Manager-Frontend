// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import expensesRoutes from "./routes/expenses.js";
import budgetsRoutes from "./routes/budgets.js";
import transactionsRoutes from "./routes/transactions.js";
import goalsRoutes from "./routes/goals.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/goals", goalsRoutes);

app.get("/", (req, res) => {
  res.send(" Personal Finance Manager API is running");
});

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(` Backend running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
