import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Receipt,
} from "lucide-react";

import ExpenseRow from "../components/molecules/ExpenseRow";
import ExpenseForm from "../components/molecules/ExpenseForm";
import Button from "../components/atoms/Button";

const initialExpenses = [
  {
    id: 1,
    description: "Canteen lunch",
    date: "Sept 24",
    rawDate: "2026-09-24",
    category: "Food",
    amount: 120,
  },

  {
    id: 2,
    description: "Jeepney fare",
    date: "Sept 24",
    rawDate: "2026-09-24",
    category: "Transportation",
    amount: 26,
  },

  {
    id: 3,
    description: "Notebook",
    date: "Sept 23",
    rawDate: "2026-09-23",
    category: "School",
    amount: 45,
  },

  {
    id: 4,
    description: "Coffee",
    date: "Sept 22",
    rawDate: "2026-09-22",
    category: "Food",
    amount: 95,
  },

  {
    id: 5,
    description: "Printing",
    date: "Sept 21",
    rawDate: "2026-09-21",
    category: "School",
    amount: 60,
  },
];

const CATEGORIES = [
  "All",
  "Food",
  "Transportation",
  "School",
  "Others",
];

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

export default function Expenses() {
  const [expenses, setExpenses] =
    useState(initialExpenses);

  const [showForm, setShowForm] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const handleAdd = (newExpense) => {
    const expense = {
      ...newExpense,
      id: Date.now(),
      date: formatDate(newExpense.date),
    };

    setExpenses((current) => [
      expense,
      ...current,
    ]);

    setShowForm(false);
  };

  const handleEdit = (updatedExpense) => {
    setExpenses((current) =>
      current.map((expense) =>
        expense.id === updatedExpense.id
          ? {
              ...updatedExpense,
              date: formatDate(
                updatedExpense.rawDate ||
                  updatedExpense.date
              ),
            }
          : expense
      )
    );

    setEditingExpense(null);
    setShowForm(false);
  };

  const handleDelete = (toRemove) => {
    const confirmed = window.confirm(
      `Delete "${toRemove.description}"?`
    );

    if (!confirmed) return;

    setExpenses((current) =>
      current.filter(
        (expense) =>
          expense.id !== toRemove.id
      )
    );
  };

  const openAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const openEdit = (expense) => {
    setEditingExpense({
      ...expense,
      rawDate:
        expense.rawDate ||
        new Date().toISOString().split("T")[0],
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        expense.category === categoryFilter;

      return (
        matchesSearch && matchesCategory
      );
    });
  }, [
    expenses,
    search,
    categoryFilter,
  ]);

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-bold">
            Transaction history
          </p>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-1">
            Expenses
          </h1>

          <p className="text-sm text-soft mt-2">
            Keep every peso accounted for.
          </p>
        </div>

        <Button
          icon={showForm ? X : Plus}
          onClick={() =>
            showForm
              ? setShowForm(false)
              : openAdd()
          }
        >
          {showForm ? "Close" : "Add expense"}
        </Button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8">
          <ExpenseForm
            initialValues={editingExpense}
            onSubmit={
              editingExpense
                ? handleEdit
                : handleAdd
            }
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-primary text-white rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-white/55 font-bold">
            Total recorded
          </p>

          <p className="font-serif font-bold text-3xl mt-2">
            ₱{total.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-line rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-soft font-bold">
            Transactions
          </p>

          <p className="font-serif font-bold text-3xl text-ink mt-2">
            {expenses.length}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-line rounded-2xl p-4 sm:p-5 mb-6 shadow-card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-soft"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search expenses..."
              className="
                w-full
                border border-line
                rounded-xl
                bg-bg
                pl-11 pr-4 py-3
                text-sm
                text-ink
                placeholder:text-soft/60
                focus:outline-none
                focus:ring-2
                focus:ring-accent/30
                focus:border-accent
              "
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <SlidersHorizontal
              size={16}
              className="text-soft shrink-0"
            />

            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setCategoryFilter(category)
                }
                className={`
                  px-3.5
                  py-2
                  rounded-lg
                  text-xs
                  font-semibold
                  whitespace-nowrap
                  transition-colors
                  ${
                    categoryFilter === category
                      ? "bg-primary text-white"
                      : "bg-bg text-soft hover:text-ink"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EXPENSE LIST */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white border border-dashed border-line rounded-2xl py-16 px-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-bg text-soft flex items-center justify-center">
            <Receipt size={24} />
          </div>

          <h3 className="font-serif font-semibold text-xl text-ink mt-4">
            No expenses found
          </h3>

          <p className="text-sm text-soft mt-2 max-w-sm mx-auto">
            {expenses.length === 0
              ? "No expenses logged yet. Add your first one to start tracking."
              : "Try changing your search or category filter."}
          </p>

          {expenses.length === 0 && (
            <Button
              className="mt-5"
              icon={Plus}
              onClick={openAdd}
            >
              Add your first expense
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-line rounded-2xl shadow-card overflow-hidden">
          <div className="perforation" />

          <div className="px-5 sm:px-6 divide-y divide-line/70">
            {filteredExpenses.map(
              (expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              )
            )}
          </div>
        </div>
      )}
    </main>
  );
}