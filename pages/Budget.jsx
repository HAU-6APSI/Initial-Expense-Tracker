import {
  Target,
  WalletCards,
  AlertTriangle,
} from "lucide-react";

import BudgetBar from "../components/molecules/BudgetBar";

const budgets = [
  {
    category: "Food",
    spent: 950,
    limit: 1200,
  },
  {
    category: "Transportation",
    spent: 620,
    limit: 500,
  },
  {
    category: "School",
    spent: 210,
    limit: 600,
  },
  {
    category: "Others",
    spent: 85,
    limit: 300,
  },
];

const getProgressColor = (percentage) => {
  if (percentage > 100) return "bg-danger";
  if (percentage >= 80) return "bg-accent";
  return "bg-success";
};

export default function Budget() {
  const totalSpent = budgets.reduce(
    (sum, item) => sum + item.spent,
    0
  );

  const totalLimit = budgets.reduce(
    (sum, item) => sum + item.limit,
    0
  );

  const remaining =
    totalLimit - totalSpent;

  const percentage =
    (totalSpent / totalLimit) * 100;

  const overBudget = budgets.filter(
    (item) => item.spent > item.limit
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-accent font-bold">
          Monthly planning
        </p>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-1">
          Budget
        </h1>

        <p className="text-sm text-soft mt-2">
          Give every part of your student life a spending limit.
        </p>
      </div>

      {/* SUMMARY */}
      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary text-white rounded-2xl p-6">
          <WalletCards
            size={20}
            className="text-white/60"
          />

          <p className="text-xs uppercase tracking-widest text-white/55 font-bold mt-5">
            Total budget
          </p>

          <p className="font-serif font-bold text-3xl mt-1">
            ₱{totalLimit.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <Target
            size={20}
            className="text-success"
          />

          <p className="text-xs uppercase tracking-widest text-soft font-bold mt-5">
            Spent
          </p>

          <p className="font-serif font-bold text-3xl text-ink mt-1">
            ₱{totalSpent.toLocaleString()}
          </p>
        </div>

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
            Remaining
          </p>

          <p
            className={`font-serif font-bold text-3xl mt-1 ${
              remaining >= 0
                ? "text-success"
                : "text-danger"
            }`}
          >
            ₱{Math.abs(remaining).toLocaleString()}
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
              {Math.round(percentage)}% of budget used
            </h2>
          </div>

          {overBudget.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-danger text-xs font-semibold">
              <AlertTriangle size={15} />
              {overBudget.length} over budget
            </div>
          )}
        </div>

        <div className="h-4 bg-bg rounded-full overflow-hidden mt-6">
          <div
            className={`h-full rounded-full ${getProgressColor(percentage)}`}
            style={{
              width: `${Math.min(
                percentage,
                100
              )}%`,
            }}
          />
        </div>
      </section>

      {/* CATEGORY BUDGETS */}
      <section className="bg-white border border-line rounded-2xl p-6 shadow-card">
        <div className="mb-3">
          <p className="text-xs uppercase tracking-widest text-accent font-bold">
            Category limits
          </p>

          <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
            Where your budget stands
          </h2>
        </div>

        <div className="divide-y divide-line/70">
          {budgets.map((budget) => (
            <BudgetBar
              key={budget.category}
              category={budget.category}
              spent={budget.spent}
              limit={budget.limit}
            />
          ))}
        </div>
      </section>
    </main>
  );
}