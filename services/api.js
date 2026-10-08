const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong with the request."
    );
  }

  return data;
}

/* =========================
   EXPENSES
========================= */

export async function getExpenses() {
  return request("/expenses");
}

export async function getExpense(id) {
  return request(`/expenses/${id}`);
}

export async function createExpense(expense) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
}

export async function updateExpense(
  id,
  expense
) {
  return request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   BUDGETS
========================= */

export async function getBudgets() {
  return request("/budgets");
}

export async function getBudget(month) {
  return request(`/budgets/${month}`);
}

export async function createBudget(budget) {
  return request("/budgets", {
    method: "POST",
    body: JSON.stringify(budget),
  });
}

export async function updateBudget(
  id,
  budget
) {
  return request(`/budgets/${id}`, {
    method: "PUT",
    body: JSON.stringify(budget),
  });
}

export async function deleteBudget(id) {
  return request(`/budgets/${id}`, {
    method: "DELETE",
  });
}