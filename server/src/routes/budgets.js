const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all budgets
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        amount,
        month,
        created_at,
        updated_at
      FROM budgets
      ORDER BY month DESC
    `);

    res.json({
      success: true,
      budgets: result.rows,
    });
  } catch (error) {
    console.error("Error fetching budgets:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch budgets",
    });
  }
});

// GET budget for a specific month
router.get("/:month", async (req, res) => {
  try {
    const { month } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        amount,
        month,
        created_at,
        updated_at
      FROM budgets
      WHERE month = $1
      `,
      [month]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.json({
      success: true,
      budget: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching budget:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch budget",
    });
  }
});

// POST create budget
router.post("/", async (req, res) => {
  try {
    const { amount, month } = req.body;

    if (amount === undefined || amount === null || amount === "" || !month) {
      return res.status(400).json({
        success: false,
        message: "Amount and month are required",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number greater than zero",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO budgets (amount, month)
      VALUES ($1, $2)
      RETURNING
        id,
        amount,
        month,
        created_at,
        updated_at
      `,
      [numericAmount, month]
    );

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A budget already exists for this month",
      });
    }

    console.error("Error creating budget:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create budget",
    });
  }
});

// PUT update budget
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, month } = req.body;

    if (amount === undefined || amount === null || amount === "" || !month) {
      return res.status(400).json({
        success: false,
        message: "Amount and month are required",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number greater than zero",
      });
    }

    const result = await pool.query(
      `
      UPDATE budgets
      SET
        amount = $1,
        month = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING
        id,
        amount,
        month,
        created_at,
        updated_at
      `,
      [numericAmount, month, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.json({
      success: true,
      message: "Budget updated successfully",
      budget: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A budget already exists for this month",
      });
    }

    console.error("Error updating budget:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update budget",
    });
  }
});

// DELETE budget
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM budgets
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting budget:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete budget",
    });
  }
});

module.exports = router;