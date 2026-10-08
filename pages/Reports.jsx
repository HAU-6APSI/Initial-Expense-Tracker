import { useEffect, useMemo, useState } from "react";

import CategoryPill from "../components/atoms/CategoryPill";
import { getExpenses } from "../services/api";
import { summarizeExpenses } from "../reportUtils";

const barColor = {
  Food: "bg-catFood",
  Transportation: "bg-catTransport",
  School: "bg-catSchool",
  Others: "bg-catOther",
};

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getExpenses();
        setExpenses(data.expenses || []);
      } catch (err) {
        setError(err.message || "Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    void loadExpenses();
  }, []);

  const { total, categoryTotals, highestCategory } = useMemo(
    () => summarizeExpenses(expenses),
    [expenses]
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-accent font-bold">
          Spending insights
        </p>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-1">
          Reports
        </h1>

        <p className="text-sm text-soft mt-2">
          Understand your spending habits at a glance.
        </p>
      </div>

      {/* SUMMARY */}
      {error ? (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mb-6 rounded-2xl border border-line bg-white p-8 text-center text-sm text-soft">
          Loading your spending report...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-primary text-white rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-white/55 font-bold">
              Total spending
            </p>

            <p className="font-serif font-bold text-3xl mt-2">
              ₱{total.toLocaleString()}
            </p>

            <p className="text-xs text-white/50 mt-2">
              Across all categories
            </p>
          </div>

          <div className="bg-white border border-line rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-soft font-bold">
              Highest category
            </p>

            <p className="font-serif font-bold text-3xl text-ink mt-2">
              {highestCategory.category}
            </p>

            <p className="text-xs text-soft mt-2">
              ₱{highestCategory.amount.toLocaleString()} spent
            </p>
          </div>
        </div>
      )}

      {/* REPORT */}
      {!loading && !error ? (
        <section className="bg-white border border-line rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-line">
            <p className="text-xs uppercase tracking-widest text-accent font-bold">
              Category breakdown
            </p>

            <h2 className="font-serif font-semibold text-2xl text-ink mt-1">
              Where your money goes
            </h2>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-10">
            {categoryTotals.length > 0 ? (
              <div className="flex items-end gap-4 h-64">
                {categoryTotals.map((category) => {
                  const percentage = total > 0 ? (category.amount / total) * 100 : 0;

                  return (
                    <div
                      key={category.category}
                      className="flex-1 h-full flex flex-col justify-end items-center gap-3"
                    >
                      <span className="text-xs font-semibold text-ink">
                        {Math.round(percentage)}%
                      </span>

                      <div className="w-full h-48 bg-bg rounded-t-xl flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-xl ${barColor[category.category] || "bg-primary"}`}
                          style={{ height: `${percentage}%` }}
                        />
                      </div>

                      <span className="text-[11px] text-soft text-center leading-tight">
                        {category.category === "Transportation"
                          ? "Transport"
                          : category.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-bg text-sm text-soft">
                No expenses recorded yet.
              </div>
            )}

            <div className="flex flex-col justify-center">
              {categoryTotals.length > 0 ? (
                <div className="space-y-1">
                  {categoryTotals.map((category) => {
                    const percentage = total > 0 ? (category.amount / total) * 100 : 0;

                    return (
                      <div
                        key={category.category}
                        className="flex items-center justify-between py-4 border-b border-line/70 last:border-0"
                      >
                        <CategoryPill category={category.category} />

                        <div className="text-right">
                          <p className="text-sm font-semibold text-ink">
                            ₱{category.amount.toLocaleString()}
                          </p>

                          <p className="text-xs text-soft mt-0.5">
                            {Math.round(percentage)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-soft">
                  Add an expense to see your category breakdown.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}