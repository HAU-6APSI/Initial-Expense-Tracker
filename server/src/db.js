const { Pool } = require("pg");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

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

const createLocalPool = () => ({
  async query(sql, values = []) {
    const text = sql.trim();

    if (text.includes("FROM expenses")) {
      if (text.includes("WHERE id =")) {
        const id = Number(values[0]);
        return { rows: localData.expenses.filter((item) => item.id === id) };
      }

      return {
        rows: [...localData.expenses].sort(
          (a, b) => new Date(b.expense_date) - new Date(a.expense_date)
        ),
      };
    }

    if (text.includes("INSERT INTO expenses")) {
      const [amount, category, expense_date, description] = values;
      const expense = {
        id: Date.now(),
        amount: Number(amount),
        category,
        expense_date,
        description: description || null,
        created_at: new Date().toISOString(),
      };
      localData.expenses.unshift(expense);
      return { rows: [expense] };
    }

    if (text.includes("UPDATE expenses")) {
      const [amount, category, expense_date, description, id] = values;
      const index = localData.expenses.findIndex(
        (item) => item.id === Number(id)
      );

      if (index === -1) return { rows: [] };

      localData.expenses[index] = {
        ...localData.expenses[index],
        amount: Number(amount),
        category,
        expense_date,
        description: description || null,
      };
      return { rows: [localData.expenses[index]] };
    }

    if (text.includes("DELETE FROM expenses")) {
      const id = Number(values[0]);
      const before = localData.expenses.length;
      localData.expenses = localData.expenses.filter(
        (item) => item.id !== id
      );
      return { rows: before === localData.expenses.length ? [] : [{ id }] };
    }

    if (text.includes("FROM budgets")) {
      if (text.includes("WHERE month =")) {
        const month = values[0];
        return {
          rows: localData.budgets.filter((item) => item.month === month),
        };
      }

      return {
        rows: [...localData.budgets].sort((a, b) =>
          b.month.localeCompare(a.month)
        ),
      };
    }

    if (text.includes("INSERT INTO budgets")) {
      const [amount, month] = values;
      const budget = {
        id: Date.now(),
        amount: Number(amount),
        month,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localData.budgets.unshift(budget);
      return { rows: [budget] };
    }

    if (text.includes("UPDATE budgets")) {
      const [amount, month, id] = values;
      const index = localData.budgets.findIndex(
        (item) => item.id === Number(id)
      );

      if (index === -1) return { rows: [] };

      localData.budgets[index] = {
        ...localData.budgets[index],
        amount: Number(amount),
        month,
        updated_at: new Date().toISOString(),
      };
      return { rows: [localData.budgets[index]] };
    }

    if (text.includes("DELETE FROM budgets")) {
      const id = Number(values[0]);
      const before = localData.budgets.length;
      localData.budgets = localData.budgets.filter(
        (item) => item.id !== id
      );
      return { rows: before === localData.budgets.length ? [] : [{ id }] };
    }

    throw new Error(`Unsupported local query: ${text}`);
  },
});

if (!databaseUrl) {
  console.warn(
    "DATABASE_URL is not configured; starting in local memory mode."
  );
}

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 10000,
    })
  : createLocalPool();

if (pool.on) {
  pool.on("connect", () => {
    console.log("PostgreSQL database connected");
  });

  pool.on("error", (error) => {
    console.error("Unexpected database error:", error.message);
  });
}

module.exports = pool;