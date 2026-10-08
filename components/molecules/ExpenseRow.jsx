import { Pencil, Trash2 } from "lucide-react";

import Button from "../atoms/Button";
import { getCategory } from "../atoms/CategoryPill";

export default function ExpenseRow({
  expense,
  onEdit,
  onDelete,
}) {
  const category = getCategory(expense.category);
  const CategoryIcon = category.icon;

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 min-w-0">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.bg}`}>
          <CategoryIcon size={18} className={category.text} />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-ink truncate">
            {expense.description || "Untitled expense"}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-soft">
            <span>{expense.date}</span>
            <span>•</span>
            <span>{expense.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="font-serif text-xl font-semibold text-ink">
          ₱{Number(expense.amount).toLocaleString()}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            icon={Pencil}
            onClick={() => onEdit(expense)}
            aria-label={`Edit ${expense.description || "expense"}`}
          >
            Edit
          </Button>

          <Button
            type="button"
            variant="danger"
            icon={Trash2}
            onClick={() => onDelete(expense)}
            aria-label={`Delete ${expense.description || "expense"}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}