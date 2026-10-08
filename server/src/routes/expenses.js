const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, amount, category, expense_date, description, created_at
       FROM expenses
       ORDER BY expense_date DESC, id DESC`
    );

    res.json({
      success: true,
      expenses: result.rows,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
});

// GET one expense
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, amount, category, expense_date, description, created_at
       FROM expenses
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      expense: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching expense:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expense",
    });
  }
});

// POST create expense
router.post("/", async (req, res) => {
  try {
    const { amount, category, expense_date, description } = req.body;

    if (!amount || !category || !expense_date) {
      return res.status(400).json({
        success: false,
        message: "Amount, category, and expense date are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO expenses
       (amount, category, expense_date, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, amount, category, expense_date, description, created_at`,
      [amount, category, expense_date, description || null]
    );

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating expense:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
});

// PUT update expense
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, expense_date, description } = req.body;

    if (!amount || !category || !expense_date) {
      return res.status(400).json({
        success: false,
        message: "Amount, category, and expense date are required",
      });
    }

    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1,
           category = $2,
           expense_date = $3,
           description = $4
       WHERE id = $5
       RETURNING id, amount, category, expense_date, description, created_at`,
      [amount, category, expense_date, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense updated successfully",
      expense: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating expense:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM expenses
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
});

module.exports = router;