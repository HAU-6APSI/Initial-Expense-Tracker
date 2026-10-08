const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const hasExternalApiUrl =
  API_URL.startsWith("http://") ||
  API_URL.startsWith("https://");

export const isBrowserStorageMode =
  import.meta.env.PROD &&
  !hasExternalApiUrl;

const STORAGE_KEY = "spendwise-data-v1";

function readStoredData() {
  const serialized = window.localStorage.getItem(STORAGE_KEY);

  if (!serialized) {
    return { expenses: [], budgets: [] };
  }

  try {
    const data = JSON.parse(serialized);
    return {
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
      budgets: Array.isArray(data.budgets) ? data.budgets : [],
    };
  } catch {
    throw new Error(
      "Saved tracker data could not be read. Clear this site's Spendwise browser storage and try again."
    );
  }
}

function writeStoredData(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function nextId(items) {
  return items.reduce(
    (highestId, item) => Math.max(highestId, Number(item.id) || 0),
    0
  ) + 1;
}

function listExpenses(items) {
  return [...items].sort(
    (a, b) =>
      b.expense_date.localeCompare(a.expense_date) ||
      Number(b.id) - Number(a.id)
  );
}

function storeExpense(data, payload, id, isUpdate) {
  const index = isUpdate
    ? data.expenses.findIndex((item) => item.id === Number(id))
    : -1;
  const previous = index < 0 ? null : data.expenses[index];

  if (isUpdate && !previous) throw new Error("Expense not found");

  const expense = {
    ...previous,
    id: previous?.id ?? nextId(data.expenses),
    amount: Number(payload.amount),
    category: payload.category,
    expense_date: payload.expense_date,
    description: payload.description || null,
    created_at: previous?.created_at ?? new Date().toISOString(),
  };

  if (previous) {
    data.expenses[index] = expense;
  } else {
    data.expenses.push(expense);
  }

  writeStoredData(data);
  return {
    success: true,
    message: `Expense ${isUpdate ? "updated" : "created"} successfully`,
    expense,
  };
}

function removeStoredItem(data, resource, id, label) {
  const remaining = data[resource].filter((item) => item.id !== Number(id));
  if (remaining.length === data[resource].length) {
    throw new Error(`${label} not found`);
  }
  data[resource] = remaining;
  writeStoredData(data);
  return { success: true, message: `${label} deleted successfully` };
}

function getStoredItem(items, predicate, label) {
  const item = items.find(predicate);
  if (!item) throw new Error(`${label} not found`);
  return item;
}

function handleExpenseStorage(data, method, id, payload) {
  switch (method) {
    case "GET":
      if (!id) return { success: true, expenses: listExpenses(data.expenses) };
      return {
        success: true,
        expense: getStoredItem(
          data.expenses,
          (item) => item.id === Number(id),
          "Expense"
        ),
      };
    case "POST":
      return storeExpense(data, payload, id, false);
    case "PUT":
      return storeExpense(data, payload, id, true);
    case "DELETE":
      return removeStoredItem(data, "expenses", id, "Expense");
    default:
      throw new Error(`Unsupported local expense request: ${method}`);
  }
}

function storeBudget(data, method, id, payload) {
  const index = method === "PUT"
    ? data.budgets.findIndex((item) => item.id === Number(id))
    : -1;

  if (method === "PUT" && index < 0) throw new Error("Budget not found");
  if (
    data.budgets.some(
      (item, itemIndex) =>
        itemIndex !== index && item.month === payload.month
    )
  ) {
    throw new Error("A budget already exists for this month");
  }

  const previous = index < 0 ? null : data.budgets[index];
  const budget = {
    id: previous?.id ?? nextId(data.budgets),
    amount: Number(payload.amount),
    month: payload.month,
    created_at: previous?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (index < 0) {
    data.budgets.push(budget);
  } else {
    data.budgets[index] = budget;
  }
  writeStoredData(data);
  return {
    success: true,
    message: `Budget ${method === "POST" ? "created" : "updated"} successfully`,
    budget,
  };
}

function handleBudgetStorage(data, method, id, payload) {
  switch (method) {
    case "GET":
      if (!id) return { success: true, budgets: data.budgets };
      return {
        success: true,
        budget: getStoredItem(
          data.budgets,
          (item) => item.month === id,
          "Budget"
        ),
      };
    case "POST":
    case "PUT":
      return storeBudget(data, method, id, payload);
    case "DELETE":
      return removeStoredItem(data, "budgets", id, "Budget");
    default:
      throw new Error(`Unsupported local budget request: ${method}`);
  }
}

function browserStorageRequest(endpoint, options = {}) {
  const [resource, id] = endpoint.split("/").filter(Boolean);
  const method = options.method || "GET";
  const payload = options.body ? JSON.parse(options.body) : {};
  const data = readStoredData();

  if (resource === "expenses") {
    return handleExpenseStorage(data, method, id, payload);
  }
  if (resource === "budgets") {
    return handleBudgetStorage(data, method, id, payload);
  }
  throw new Error(`Unsupported local resource: ${resource}`);
}

async function request(endpoint, options = {}) {
  if (isBrowserStorageMode) {
    return browserStorageRequest(endpoint, options);
  }

  const baseUrl = API_URL.endsWith("/")
    ? API_URL.slice(0, -1)
    : API_URL;
  const url = `${baseUrl}${endpoint}`;
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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