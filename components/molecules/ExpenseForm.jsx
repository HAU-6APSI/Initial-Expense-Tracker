import { useState } from "react";
import Button from "../atoms/Button";

const CATEGORIES = ["Food", "Transportation", "School", "Others"];

const inputClass =
  "w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";
const labelClass = "text-xs font-medium text-soft uppercase tracking-wide block mb-1.5";

export default function ExpenseForm({ initialValues, onSubmit, onCancel }) {
  const [amount, setAmount] = useState(initialValues?.amount || "");
  const [category, setCategory] = useState(initialValues?.category || CATEGORIES[0]);
  const [date, setDate] = useState(initialValues?.date || "");
  const [description, setDescription] = useState(initialValues?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ amount, category, date, description });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl p-5">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} placeholder="0.00" />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </div>

      <div className="mb-5">
        <label className={labelClass}>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="What was this for?" />
      </div>

      <Button type="submit" variant="primary">Save expense</Button>
      <Button type="button" variant="secondary" onClick={onCancel} className="ml-2">Cancel</Button>
    </form>
  );
}
