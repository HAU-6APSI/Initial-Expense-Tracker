import { useEffect, useMemo, useState } from "react";

import {
  Target,
  WalletCards,
  AlertTriangle,
  Save,
  Pencil,
  RefreshCw,
} from "lucide-react";

import BudgetBar from "../components/molecules/BudgetBar";

import {
  getExpenses,
  getBudgets,
  createBudget,
  updateBudget,
} from "../services/api";

const DEFAULT_BUDGET = 4000;

const CATEGORIES = [
  "Food",
  "Transportation",
  "School",
  "Others",
];

const getCurrentMonth = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
};

const getProgressColor = (percentage) => {
  if (percentage > 100) {
    return "bg-danger";
  }

  if (percentage >= 80) {
    return "bg-accent";
  }

  return "bg-success";
};

export default function Budget() {
  const [expenses, setExpenses] = useState([]);

  const [budgetRecord, setBudgetRecord] =
    useState(null);

  const [budgetAmount, setBudgetAmount] =
    useState(DEFAULT_BUDGET);

  const [budgetInput, setBudgetInput] =
    useState(String(DEFAULT_BUDGET));

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const currentMonth = getCurrentMonth();

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        expenseData,
        budgetData,
      ] = await Promise.all([
        getExpenses(),
        getBudgets(),
      ]);

      setExpenses(
        expenseData.expenses || []
      );

      const budgets =
        budgetData.budgets || [];

      const currentBudget =
        budgets.find(
          (item) =>
            String(item.month) ===
            currentMonth
        );

      if (currentBudget) {
        const amount =
          Number(currentBudget.amount);

        setBudgetRecord(
          currentBudget
        );

        setBudgetAmount(amount);

        setBudgetInput(
          String(amount)
        );
      } else {
        setBudgetRecord(null);

        setBudgetAmount(
          DEFAULT_BUDGET
        );

        setBudgetInput(
          String(DEFAULT_BUDGET)
        );
      }
    } catch (err) {
      console.error(
        "Failed to load budget:",
        err
      );

      setError(
        err.message ||
          "Unable to load budget data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => {
        return (
          sum +
          Number(expense.amount || 0)
        );
      },
      0
    );
  }, [expenses]);

  const remaining =
    budgetAmount - totalSpent;

  const percentage =
    budgetAmount > 0
      ? (totalSpent /
          budgetAmount) *
        100
      : 0;

  const overBudget =
    totalSpent > budgetAmount;

  const categoryBudgets =
    useMemo(() => {
      return CATEGORIES.map(
        (category) => {
          const spent = expenses
            .filter(
              (expense) =>
                expense.category ===
                category
            )
            .reduce(
              (sum, expense) =>
                sum +
                Number(
                  expense.amount || 0
                ),
              0
            );

          const categoryLimit =
            budgetAmount /
            CATEGORIES.length;

          return {
            category,
            spent,
            limit: categoryLimit,
          };
        }
      );
    }, [
      expenses,
      budgetAmount,
    ]);

  const handleSaveBudget = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const amount = Number(
      budgetInput
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Budget must be greater than zero."
      );

      return;
    }

    try {
      setSaving(true);

      if (budgetRecord) {
        await updateBudget(
          budgetRecord.id,
          {
            amount,
            month: currentMonth,
          }
        );
      } else {
        await createBudget({
          amount,
          month: currentMonth,
        });
      }

      /*
       * Reload the data from the backend
       * after saving. This guarantees that
       * the UI displays the actual value
       * stored in Supabase.
       */
      await loadBudgetData();

      setSuccess(
        "Monthly budget updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to save budget:",
        err
      );

      setError(
        err.message ||
          "Unable to save your budget."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-bold">
            Monthly planning
          </p>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-1">
            Budget
          </h1>

          <p className="text-sm text-soft mt-2">
            Set your monthly limit and keep
            your spending under control.
          </p>
        </div>

        <div className="text-sm text-soft">
          Current month:{" "}
          <span className="font-semibold text-ink">
            {new Date().toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </span>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-6 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
          {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-line rounded-2xl shadow-card py-16 text-center">

          <div className="w-8 h-8 mx-auto rounded-full border-2 border-line border-t-primary animate-spin" />

          <p className="text-sm text-soft mt-4">
            Loading your budget...
          </p>

        </div>
      ) : (
        <>
          {/* SET BUDGET */}

          <section className="bg-white border border-line rounded-2xl p-6 shadow-card mb-6">

            <div className="flex items-start gap-4 mb-5">

              <div className="w-11 h-11 rounded-xl bg-bg flex items-center justify-center text-primary">
                <Pencil size={19} />
              </div>

              <div>

                <p className="text-xs uppercase tracking-widest text-accent font-bold">
                  Monthly limit
                </p>

                <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
                  Set your budget
                </h2>

                <p className="text-sm text-soft mt-1">
                  This amount will be used to
                  calculate your spending progress.
                </p>

              </div>

            </div>

            <form
              onSubmit={handleSaveBudget}
              className="flex flex-col sm:flex-row gap-3"
            >

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-soft font-semibold">
                  ₱
                </span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={budgetInput}
                  onChange={(e) =>
                    setBudgetInput(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border border-line
                    rounded-xl
                    bg-bg
                    pl-9 pr-4 py-3
                    text-sm
                    text-ink
                    focus:outline-none
                    focus:ring-2
                    focus:ring-accent/30
                    focus:border-accent
                  "
                  placeholder="4000"
                  required
                />

              </div>

              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-5
                  py-3
                  bg-primary
                  text-white
                  text-sm
                  font-semibold
                  transition-colors
                  hover:bg-primary/90
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                {saving ? (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                {saving
                  ? "Saving..."
                  : budgetRecord
                  ? "Update budget"
                  : "Save budget"}

              </button>

            </form>

          </section>

          {/* SUMMARY */}

          <section className="grid md:grid-cols-3 gap-4 mb-8">

            {/* TOTAL BUDGET */}

            <div className="bg-primary text-white rounded-2xl p-6">

              <WalletCards
                size={20}
                className="text-white/60"
              />

              <p className="text-xs uppercase tracking-widest text-white/55 font-bold mt-5">
                Total budget
              </p>

              <p className="font-serif font-bold text-3xl mt-1">
                ₱
                {budgetAmount.toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

            </div>

            {/* SPENT */}

            <div className="bg-white border border-line rounded-2xl p-6">

              <Target
                size={20}
                className="text-success"
              />

              <p className="text-xs uppercase tracking-widest text-soft font-bold mt-5">
                Spent
              </p>

              <p className="font-serif font-bold text-3xl text-ink mt-1">
                ₱
                {totalSpent.toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

            </div>

            {/* REMAINING */}

            <div className="bg-white border border-line rounded-2xl p-6">

              <Target
                size={20}
                className={
                  remaining >= 0
                    ? "text-success"
                    : "text-danger"
                }
              />

              <p className="text-xs uppercase tracking-widest text-soft font-bold mt-5">
                {remaining >= 0
                  ? "Remaining"
                  : "Over budget"}
              </p>

              <p
                className={`font-serif font-bold text-3xl mt-1 ${
                  remaining >= 0
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                ₱
                {Math.abs(
                  remaining
                ).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

            </div>

          </section>

          {/* OVERALL PROGRESS */}

          <section className="bg-white border border-line rounded-2xl p-6 shadow-card mb-6">

            <div className="flex justify-between items-end">

              <div>

                <p className="text-xs uppercase tracking-widest text-accent font-bold">
                  Overall progress
                </p>

                <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
                  {Math.round(
                    percentage
                  )}
                  % of budget used
                </h2>

              </div>

              {overBudget && (
                <div className="hidden sm:flex items-center gap-2 text-danger text-xs font-semibold">
                  <AlertTriangle
                    size={15}
                  />
                  Over budget
                </div>
              )}

            </div>

            <div className="h-4 bg-bg rounded-full overflow-hidden mt-6">

              <div
                className={`h-full rounded-full transition-all ${getProgressColor(
                  percentage
                )}`}
                style={{
                  width: `${Math.min(
                    percentage,
                    100
                  )}%`,
                }}
              />

            </div>

            <div className="flex justify-between mt-3 text-xs text-soft">

              <span>
                ₱
                {totalSpent.toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                spent
              </span>

              <span>
                ₱
                {budgetAmount.toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                limit
              </span>

            </div>

          </section>

          {/* CATEGORY BUDGETS */}

          <section className="bg-white border border-line rounded-2xl p-6 shadow-card">

            <div className="mb-3">

              <p className="text-xs uppercase tracking-widest text-accent font-bold">
                Category spending
              </p>

              <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
                Where your money goes
              </h2>

              <p className="text-sm text-soft mt-1">
                Your spending grouped by category.
              </p>

            </div>

            <div className="divide-y divide-line/70">

              {categoryBudgets.map(
                (budget) => (
                  <BudgetBar
                    key={
                      budget.category
                    }
                    category={
                      budget.category
                    }
                    spent={
                      budget.spent
                    }
                    limit={
                      budget.limit
                    }
                  />
                )
              )}

            </div>

          </section>
        </>
      )}
    </main>
  );
}