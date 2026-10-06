import CategoryPill from "../components/atoms/CategoryPill";

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

const barColor = {
  Food: "bg-catFood",
  Transportation: "bg-catTransport",
  School: "bg-catSchool",
  Others: "bg-catOther",
};

export default function Reports() {
  const total = categoryTotals.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const sorted = [...categoryTotals].sort(
    (a, b) => b.amount - a.amount
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
            {sorted[0].category}
          </p>

          <p className="text-xs text-soft mt-2">
            ₱{sorted[0].amount.toLocaleString()} spent
          </p>
        </div>
      </div>

      {/* REPORT */}
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
          {/* CHART */}
          <div className="flex items-end gap-4 h-64">
            {categoryTotals.map(
              (category) => {
                const percentage =
                  (category.amount / total) *
                  100;

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
                        className={`w-full rounded-t-xl ${barColor[category.category]}`}
                        style={{
                          height: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="text-[11px] text-soft text-center leading-tight">
                      {category.category ===
                      "Transportation"
                        ? "Transport"
                        : category.category}
                    </span>
                  </div>
                );
              }
            )}
          </div>

          {/* LEGEND */}
          <div className="flex flex-col justify-center">
            <div className="space-y-1">
              {sorted.map((category) => {
                const percentage =
                  (category.amount / total) *
                  100;

                return (
                  <div
                    key={category.category}
                    className="flex items-center justify-between py-4 border-b border-line/70 last:border-0"
                  >
                    <CategoryPill
                      category={category.category}
                    />

                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink">
                        ₱
                        {category.amount.toLocaleString()}
                      </p>

                      <p className="text-xs text-soft mt-0.5">
                        {Math.round(percentage)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}