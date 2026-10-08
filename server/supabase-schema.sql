-- Supabase database setup for the student expense tracker.
-- This script creates the required tables, indexes, sample data, and reports.

DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS budgets;

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('Food', 'Transportation', 'School', 'Others')
    ),
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    month VARCHAR(7) NOT NULL CHECK (
        month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (month)
);

CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_budgets_month ON budgets(month);

INSERT INTO expenses (amount, category, expense_date, description)
VALUES
    (150.00, 'Food', CURRENT_DATE, 'Lunch'),
    (80.00, 'Transportation', CURRENT_DATE, 'Jeepney fare'),
    (250.00, 'School', CURRENT_DATE, 'School supplies'),
    (100.00, 'Others', CURRENT_DATE, 'Miscellaneous');

INSERT INTO budgets (amount, month)
VALUES (4000.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'));

SELECT
    id,
    amount,
    category,
    expense_date,
    description,
    created_at
FROM expenses
ORDER BY expense_date DESC, id DESC;

SELECT
    id,
    amount,
    month,
    created_at,
    updated_at
FROM budgets
ORDER BY month DESC;

SELECT COALESCE(SUM(amount), 0) AS total_spent FROM expenses;

SELECT
    category,
    COALESCE(SUM(amount), 0) AS total_spent
FROM expenses
GROUP BY category
ORDER BY total_spent DESC;

SELECT
    COALESCE(SUM(amount), 0) AS current_month_spending
FROM expenses
WHERE expense_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND expense_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

SELECT
    b.amount AS monthly_budget,
    COALESCE(SUM(e.amount), 0) AS total_spent,
    b.amount - COALESCE(SUM(e.amount), 0) AS remaining
FROM budgets b
LEFT JOIN expenses e
    ON e.expense_date >= DATE_TRUNC('month', CURRENT_DATE)
   AND e.expense_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
WHERE b.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
GROUP BY b.amount;
