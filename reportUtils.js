export function summarizeExpenses(expenses) {
  const totals = expenses.reduce((result, expense) => {
    const category = expense.category || "Others";
    const amount = Number(expense.amount) || 0;

    result[category] = (result[category] || 0) + amount;
    return result;
  }, {});

  const categoryTotals = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const total = categoryTotals.reduce((sum, item) => sum + item.amount, 0);

  return {
    total,
    categoryTotals,
    highestCategory: categoryTotals[0] || { category: "None", amount: 0 },
  };
}
