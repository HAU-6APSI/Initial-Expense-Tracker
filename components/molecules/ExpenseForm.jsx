import { useEffect, useState } from "react";
import Button from "../atoms/Button";

const CATEGORIES = [
  "Food",
  "Transportation",
  "School",
  "Others",
];

const inputClass =
  "w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";

const labelClass =
  "text-xs font-medium text-soft uppercase tracking-wide block mb-1.5";

export default function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setAmount(initialValues?.amount ?? "");
    setCategory(initialValues?.category ?? CATEGORIES[0]);

    setDate(
      initialValues?.rawDate ||
        initialValues?.expense_date ||
        initialValues?.date ||
        ""
    );

    setDescription(initialValues?.description ?? "");
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({
      id: initialValues?.id,
      amount: Number(amount),
      category,
      date,
      description,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-line rounded-xl p-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>Amount</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Date</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="mb-5">
        <label className={labelClass}>Description</label>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="What was this for?"
          maxLength={255}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save expense"}
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        className="ml-2"
        disabled={saving}
      >
        Cancel
      </Button>
    </form>
  );
}