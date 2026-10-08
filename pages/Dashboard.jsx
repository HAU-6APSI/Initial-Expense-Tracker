import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import StatCard from "../components/molecules/StatCard";
import ExpenseRow from "../components/molecules/ExpenseRow";
import CategoryPill from "../components/atoms/CategoryPill";
import Button from "../components/atoms/Button";

import {
  getExpenses,
  getBudgets,
} from "../services/api";

const DEFAULT_BUDGET = 4000;

const getCategoryColor = (category) => {
  if (category === "Food") return "bg-catFood";
  if (category === "Transportation") {
    return "bg-catTransport";
  }
  if (category === "School") return "bg-catSchool";
  return "bg-catOther";
};

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [expenseData, budgetData] =
          await Promise.all([
            getExpenses(),
            getBudgets(),
          ]);

        const normalizedExpenses =
          (expenseData.expenses || []).map(
            (expense) => ({
              id: expense.id,
              amount: Number(expense.amount),
              category: expense.category,
              description:
                expense.description || "",
              rawDate: expense.expense_date,
              date: formatDate(
                expense.expense_date
              ),
            })
          );

        setExpenses(normalizedExpenses);

        /*
         * Get the budget for the current month.
         * The backend stores months as YYYY-MM.
         */
        const currentMonth =
          new Date()
            .toISOString()
            .slice(0, 7);

        const currentBudget =
          (budgetData.budgets || []).find(
            (item) =>
              item.month === currentMonth
          );

        if (currentBudget) {
          setBudget(
            Number(currentBudget.amount)
          );
        } else {
          setBudget(DEFAULT_BUDGET);
        }
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );
  }, [expenses]);

  const remaining = budget - totalSpent;

  const percentage =
    budget > 0
      ? (totalSpent / budget) * 100
      : 0;

  const categoryTotals = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }

      totals[expense.category] += Number(
        expense.amount
      );
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const topCategory =
    categoryTotals.length > 0
      ? categoryTotals[0]
      : {
          category: "None",
          amount: 0,
        };

  const recentExpenses = expenses.slice(0, 3);

  const isOverBudget = totalSpent > budget;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* HERO */}

      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-[0.18em]">
              <Sparkles size={14} />
              Student money dashboard
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-2">
              Your money,
              <br className="sm:hidden" /> at a glance.
            </h1>

            <p className="text-soft text-sm mt-2 max-w-lg">
              Keep track of where your money goes
              and stay ahead of your monthly budget.
            </p>
          </div>

          <Button onClick={() => navigate("/expenses")}>
            Add expense
          </Button>
        </div>
      </section>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="bg-white border border-line rounded-2xl shadow-card py-16 text-center">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-line border-t-primary animate-spin" />

          <p className="text-sm text-soft mt-4">
            Loading your dashboard...
          </p>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}

          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total spent"
              value={`₱${totalSpent.toLocaleString()}`}
              description="This month's expenses"
              icon={Wallet}
              tone="primary"
            />

            <StatCard
              label="Budget remaining"
              value={`₱${Math.abs(
                remaining
              ).toLocaleString()}`}
              description={`of ₱${budget.toLocaleString()} monthly budget`}
              icon={PiggyBank}
              tone={
                remaining >= 0
                  ? "success"
                  : "danger"
              }
              highlight
            />

            <StatCard
              label="Top category"
              value={topCategory.category}
              description={`₱${topCategory.amount.toLocaleString()} spent`}
              icon={TrendingUp}
              tone="accent"
            />
          </section>

          {/* MAIN GRID */}

          <section className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">

            {/* SPENDING OVERVIEW */}

            <div className="bg-surface border border-line rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-line">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-accent">
                      Monthly overview
                    </p>

                    <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
                      Spending progress
                    </h2>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isOverBudget
                        ? "text-danger"
                        : "text-soft"
                    }`}
                  >
                    {Math.round(percentage)}%
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs text-soft mb-2">
                    <span>
                      ₱
                      {totalSpent.toLocaleString()}{" "}
                      spent
                    </span>

                    <span>
                      ₱{budget.toLocaleString()} budget
                    </span>
                  </div>

                  <div className="h-4 rounded-full bg-bg overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CATEGORY */}

              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-ink">
                      Spending by category
                    </h3>

                    <p className="text-xs text-soft mt-1">
                      Where your money is going
                    </p>
                  </div>
                </div>

                {categoryTotals.length === 0 ? (
                  <p className="text-sm text-soft">
                    No expenses recorded yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {categoryTotals.map(
                      (item) => {
                        const percent =
                          totalSpent > 0
                            ? (item.amount /
                                totalSpent) *
                              100
                            : 0;

                        return (
                          <div
                            key={item.category}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <CategoryPill
                                category={
                                  item.category
                                }
                                compact
                              />

                              <span className="text-xs font-semibold text-ink">
                                ₱
                                {item.amount.toLocaleString()}
                              </span>
                            </div>

                            <div className="h-2 bg-bg rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getCategoryColor(
                                  item.category
                                )}`}
                                style={{
                                  width: `${percent}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* BUDGET SNAPSHOT */}

            <div className="bg-primary text-white rounded-2xl p-6 shadow-card">
              <p className="text-xs uppercase tracking-widest text-white/55 font-bold">
                Budget health
              </p>

              <h2 className="font-serif font-semibold text-2xl mt-1">
                {isOverBudget
                  ? "Budget exceeded."
                  : "You're on track."}
              </h2>

              <p className="text-sm text-white/65 mt-2 leading-relaxed">
                {isOverBudget
                  ? `You've exceeded your monthly budget by ₱${Math.abs(
                      remaining
                    ).toLocaleString()}.`
                  : `You've used ${Math.round(
                      percentage
                    )}% of your monthly budget. Keep your spending steady.`}
              </p>

              <div className="mt-8">
                <div className="flex justify-between text-xs text-white/65 mb-2">
                  <span>Used</span>

                  <span>
                    ₱{totalSpent.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isOverBudget
                        ? "bg-danger"
                        : "bg-accent"
                    }`}
                    style={{
                      width: `${Math.min(
                        percentage,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10">
                <p className="text-xs text-white/50">
                  {remaining >= 0
                    ? "Remaining"
                    : "Over budget"}
                </p>

                <p className="font-serif font-bold text-3xl mt-1">
                  ₱
                  {Math.abs(
                    remaining
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* RECENT EXPENSES */}

          <section className="mt-8">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-accent">
                  Activity
                </p>

                <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
                  Recent expenses
                </h2>
              </div>

              <a
                href="/expenses"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
              >
                View all
                <ArrowRight size={15} />
              </a>
            </div>

            <div className="bg-surface border border-line rounded-2xl shadow-card overflow-hidden">
              {recentExpenses.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-soft">
                    No expenses recorded yet.
                  </p>
                </div>
              ) : (
                <div className="px-5 sm:px-6 divide-y divide-line/70">
                  {recentExpenses.map(
                    (expense) => (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                      />
                    )
                  )}
                </div>
              )}

              <div className="sm:hidden border-t border-line p-4">
                <a
                  href="/expenses"
                  className="flex justify-center items-center gap-2 text-sm font-semibold text-primary"
                >
                  View all expenses
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}