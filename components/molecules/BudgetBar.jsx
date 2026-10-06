export default function BudgetBar({ category, spent, limit }) {
  const percent = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-ink">{category}</span>
        <span className="tabular-nums text-xs text-soft">
          ₱{spent.toLocaleString()} <span className="text-line">/</span> ₱{limit.toLocaleString()}
        </span>
      </div>

      <div className="relative h-2.5 rounded-full bg-line/60 overflow-visible">
        <div
          className={`h-full rounded-full transition-all ${isOver ? "bg-danger" : "bg-success"}`}
          style={{ width: `${percent}%` }}
        />
        {/* tick marks at 25/50/75 */}
        {[25, 50, 75].map((t) => (
          <span
            key={t}
            className="absolute top-0 h-full w-px bg-paper/80"
            style={{ left: `${t}%` }}
          />
        ))}
      </div>

      {isOver && (
        <div className="text-xs text-danger font-medium mt-1.5">
          Over budget by ₱{(spent - limit).toLocaleString()}
        </div>
      )}
    </div>
  );
}
