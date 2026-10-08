const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

async function request(endpoint, options = {}) {
  const url = `${API_URL.replace(/\/+$/, "")}${endpoint}`;
  let response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    const reason =
      error instanceof Error ? ` ${error.message}` : "";
    throw new Error(
      `Unable to reach the API at ${url}.${reason} Start the app with "npm run dev" locally, or check VITE_API_URL for a deployed app.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `The API returned a non-JSON response (HTTP ${response.status}, ${response.headers.get("content-type") || "unknown content type"}). Check that VITE_API_URL points to the API server, then restart the app.`
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