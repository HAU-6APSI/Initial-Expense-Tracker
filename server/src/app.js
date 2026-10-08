const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const expenseRoutes = require("./routes/expenses");
const budgetRoutes = require("./routes/budgets");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

const localData = {
  expenses: [
    {
      id: 1,
      amount: 120,
      category: "Food",
      expense_date: "2026-09-24",
      description: "Canteen lunch",
      created_at: "2026-09-24T12:00:00.000Z",
    },
    {
      id: 2,
      amount: 26,
      category: "Transportation",
      expense_date: "2026-09-24",
      description: "Jeepney fare",
      created_at: "2026-09-24T12:30:00.000Z",
    },
    {
      id: 3,
      amount: 45,
      category: "School",
      expense_date: "2026-09-23",
      description: "Notebook",
      created_at: "2026-09-23T08:00:00.000Z",
    },
  ],
  budgets: [
    {
      id: 1,
      amount: 4000,
      month: "2026-09",
      created_at: "2026-09-01T00:00:00.000Z",
      updated_at: "2026-09-01T00:00:00.000Z",
    },
  ],
};

app.disable("x-powered-by");
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running",
    database: process.env.DATABASE_URL ? "connected" : "local",
    time: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
  if (!process.env.DATABASE_URL) {
    req.localData = localData;
  }
  next();
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
}

module.exports = app;