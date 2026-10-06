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

const BUDGET = 4000;

const recentExpenses = [
  {
    id: 1,
    description: "Canteen lunch",
    date: "Sept 24",
    category: "Food",
    amount: 120,
  },
  {
    id: 2,
    description: "Jeepney fare",
    date: "Sept 24",
    category: "Transportation",
    amount: 26,
  },
  {
    id: 3,
    description: "Notebook",
    date: "Sept 23",
    category: "School",
    amount: 45,
  },
];

const categoryTotals = [
  {
    category: "Food",
    amount: 950,
  },
  {
    category: "Transportation",
    amount: 620,
  },
  {
    category: "School",
    amount: 210,
  },
  {
    category: "Others",
    amount: 85,
  },
];

const getCategoryColor = (category) => {
  if (category === "Food") return "bg-catFood";
  if (category === "Transportation") return "bg-catTransport";
  if (category === "School") return "bg-catSchool";
  return "bg-catOther";
};

export default function Dashboard() {
  const totalSpent = 2450;
  const remaining = Math.max(
    BUDGET - totalSpent,
    0
  );

  const percentage =
    (totalSpent / BUDGET) * 100;

  const topCategory =
    categoryTotals.reduce(
      (max, current) =>
        current.amount > max.amount
          ? current
          : max,
      categoryTotals[0]
    );

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

          <Button>
            Add expense
          </Button>
        </div>
      </section>

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
          value={`₱${remaining.toLocaleString()}`}
          description={`of ₱${BUDGET.toLocaleString()} monthly budget`}
          icon={PiggyBank}
          tone="success"
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

              <span className="text-sm font-semibold text-soft">
                {Math.round(percentage)}%
              </span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-soft mb-2">
                <span>
                  ₱{totalSpent.toLocaleString()} spent
                </span>

                <span>
                  ₱{BUDGET.toLocaleString()} budget
                </span>
              </div>

              <div className="h-4 rounded-full bg-bg overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

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

            <div className="space-y-4">
              {categoryTotals.map((item) => {
                const percent =
                  (item.amount / totalSpent) *
                  100;

                return (
                  <div key={item.category}>
                    <div className="flex justify-between items-center mb-2">
                      <CategoryPill
                        category={item.category}
                        compact
                      />

                      <span className="text-xs font-semibold text-ink">
                        ₱{item.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 bg-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getCategoryColor(item.category)}`}
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BUDGET SNAPSHOT */}
        <div className="bg-primary text-white rounded-2xl p-6 shadow-card">
          <p className="text-xs uppercase tracking-widest text-white/55 font-bold">
            Budget health
          </p>

          <h2 className="font-serif font-semibold text-2xl mt-1">
            You're on track.
          </h2>

          <p className="text-sm text-white/65 mt-2 leading-relaxed">
            You've used {Math.round(percentage)}%
            of your monthly budget. Keep your
            spending steady to finish the month
            comfortably.
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
                className="h-full bg-accent rounded-full"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10">
            <p className="text-xs text-white/50">
              Remaining
            </p>

            <p className="font-serif font-bold text-3xl mt-1">
              ₱{remaining.toLocaleString()}
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
          <div className="px-5 sm:px-6 divide-y divide-line/70">
            {recentExpenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
              />
            ))}
          </div>

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
    </main>
  );
}