import test from "node:test";
import assert from "node:assert/strict";

import { summarizeExpenses } from "./reportUtils.js";

test("summarizes expenses by category and totals", () => {
  const summary = summarizeExpenses([
    { amount: 100, category: "Food" },
    { amount: 50, category: "Food" },
    { amount: 30, category: "School" },
  ]);

  assert.equal(summary.total, 180);
  assert.deepEqual(summary.categoryTotals, [
    { category: "Food", amount: 150 },
    { category: "School", amount: 30 },
  ]);
});

test("returns empty totals when there are no expenses", () => {
  const summary = summarizeExpenses([]);

  assert.equal(summary.total, 0);
  assert.deepEqual(summary.categoryTotals, []);
  assert.equal(summary.highestCategory.category, "None");
});
