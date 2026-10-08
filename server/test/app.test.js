const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/app");

const startServer = () =>
  new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });

test("serves health and local expense data without DATABASE_URL", async () => {
  const { server, port } = await startServer();

  try {
    const health = await fetch(`http://127.0.0.1:${port}/api/health`);
    const healthData = await health.json();

    assert.equal(health.ok, true);
    assert.equal(healthData.success, true);
    assert.equal(healthData.database, "local");

    const expenses = await fetch(`http://127.0.0.1:${port}/api/expenses`);
    const expensesData = await expenses.json();

    assert.equal(expenses.ok, true);
    assert.equal(Array.isArray(expensesData.expenses), true);
    assert.ok(expensesData.expenses.length > 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("creates and updates expenses in local mode", async () => {
  const { server, port } = await startServer();

  try {
    const createResponse = await fetch(`http://127.0.0.1:${port}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 100,
        category: "Food",
        expense_date: "2026-10-08",
        description: "Lunch",
      }),
    });
    const created = await createResponse.json();

    assert.equal(createResponse.status, 201);
    assert.equal(created.expense.amount, 100);
    assert.equal(created.expense.category, "Food");

    const updateResponse = await fetch(
      `http://127.0.0.1:${port}/api/expenses/${created.expense.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 150,
          category: "Food",
          expense_date: "2026-10-08",
          description: "Dinner",
        }),
      }
    );
    const updated = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updated.expense.amount, 150);
    assert.equal(updated.expense.description, "Dinner");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("updates an existing budget for the current month in local mode", async () => {
  const { server, port } = await startServer();

  try {
    const month = new Date().toISOString().slice(0, 7);
    const createResponse = await fetch(`http://127.0.0.1:${port}/api/budgets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 4000, month }),
    });
    const created = await createResponse.json();

    assert.equal(createResponse.status, 201);
    assert.equal(created.budget.amount, 4000);

    const updateResponse = await fetch(`http://127.0.0.1:${port}/api/budgets/${created.budget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 6000, month }),
    });
    const updated = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updated.budget.amount, 6000);

    const budgetsResponse = await fetch(`http://127.0.0.1:${port}/api/budgets`);
    const budgets = await budgetsResponse.json();
    const currentBudget = budgets.budgets.find((item) => item.month === month);

    assert.equal(currentBudget.amount, 6000);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
