import { useEffect, useState } from "react";
import {
  CalendarDays,
  PhilippinePeso,
  Tag,
  FileText,
} from "lucide-react";

import Button from "../atoms/Button";

const CATEGORIES = [
  "Food",
  "Transportation",
  "School",
  "Others",
];

const inputClass = `
  w-full
  border border-line
  rounded-xl
  px-4 py-3
  text-sm
  bg-white
  text-ink
  transition-all
  placeholder:text-soft/60
  focus:outline-none
  focus:ring-2
  focus:ring-accent/30
  focus:border-accent
`;

const labelClass =
  "text-xs font-semibold text-soft uppercase tracking-wider block mb-2";

export default function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
}) {
  const [amount, setAmount] = useState(
    initialValues?.amount ?? ""
  );

  const [category, setCategory] = useState(
    initialValues?.category ?? CATEGORIES[0]
  );

  const [date, setDate] = useState(
    initialValues?.rawDate ??
      initialValues?.date ??
      new Date().toISOString().split("T")[0]
  );

  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );

  useEffect(() => {
    setAmount(initialValues?.amount ?? "");

    setCategory(
      initialValues?.category ?? CATEGORIES[0]
    );

    setDate(
      initialValues?.rawDate ??
        initialValues?.date ??
        new Date().toISOString().split("T")[0]
    );

    setDescription(
      initialValues?.description ?? ""
    );
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return;
    }

    if (!description.trim()) {
      return;
    }

    onSubmit?.({
      ...initialValues,
      amount: Number(amount),
      category,
      date,
      rawDate: date,
      description: description.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-line rounded-2xl p-5 sm:p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-bold">
            Transaction
          </p>

          <h3 className="font-serif font-semibold text-xl text-ink mt-1">
            {initialValues
              ? "Edit expense"
              : "Add an expense"}
          </h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <PhilippinePeso size={19} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="expense-amount" className={labelClass}>
            Amount
          </label>

          <div className="relative">
            <PhilippinePeso
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-soft"
            />

            <input
              id="expense-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className={`${inputClass} pl-10`}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="expense-category" className={labelClass}>
            Category
          </label>

          <div className="relative">
            <Tag
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-soft"
            />

            <select
              id="expense-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className={`${inputClass} pl-10 appearance-none`}
            >
              {CATEGORIES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="expense-date" className={labelClass}>
          Date
        </label>

        <div className="relative">
          <CalendarDays
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-soft"
          />

          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className={`${inputClass} pl-10`}
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="expense-description" className={labelClass}>
          Description
        </label>

        <div className="relative">
          <FileText
            size={16}
            className="absolute left-4 top-3.5 text-soft"
          />

          <input
            id="expense-description"
            type="text"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className={`${inputClass} pl-10`}
            placeholder="What did you spend it on?"
            maxLength={80}
            required
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">
          {initialValues
            ? "Update expense"
            : "Save expense"}
        </Button>
      </div>
    </form>
  );
}