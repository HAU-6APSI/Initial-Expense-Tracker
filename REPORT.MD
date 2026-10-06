Finals Week 1 · Project Increment Report

Expense Tracker for Students
Week of September 22–28, 2026
What changed this week
Scaffolded the React app with Vite and set up react-router-dom for the four routes from Document 1: Dashboard (/), Expenses (/expenses), Budget (/budget), Reports (/reports).
Broke the repeated pieces identified in Document 2 into real components: Button, CategoryPill (atoms), StatCard, ExpenseRow, BudgetBar, ExpenseForm (molecules), and Navbar (organism).
Installed and configured Tailwind CSS and lucide-react, and mapped Document 3's colour/type/spacing tokens into tailwind.config.js.
Restyled the UI around a "ledger / receipt" visual concept — dotted receipt-style expense lines, a stamped-badge look for stat cards, category icons, and a gauge-style budget bar — after feedback that the design needed to be more distinctive.
Populated each page with mock data so the app is clickable end to end (adding/deleting an expense already updates the screen).
Why
To turn planning into a real app: Documents 1–3 were diagrams and tables; this week was about making them clickable.
Routing matched the proposal: the four routes needed to exist as real pages, not just a table of "what each route owns."
Components matched the wireframes: Document 2 already identified which pieces repeat (Navbar, ExpenseRow, BudgetBar); building them as separate files instead of copy-pasted markup was the whole point of that document.
Styling from tokens, not defaults: both to follow Document 3 and because of direct feedback that the expense tracker's UI needed a stronger, less generic identity.
What broke or what I got stuck on
Fixed
npm run dev failed with Missing script: "dev" — I was running it inside a loose src folder instead of the actual Vite project root, since only the component files had been copied in and I didn't realize package.json has to live one level up.

Fixed
Extracted a project zip directly into Downloads instead of into its own folder — package.json, index.html, and src ended up loose among unrelated files. Fixed by creating a dedicated project folder and moving the files in, and by re-extracting later zips with "Extract All" instead of dragging files out manually.

Open still debugging
App now runs (npm run dev succeeds, localhost:5173 loads) but renders a blank white page with no visible error overlay. Currently checking the browser DevTools console for the actual JS error to figure out what's failing to render.

What is left
Find and fix the current blank-page bug.
Wire a Node/Express + PostgreSQL backend so recentExpenses, budgets, and categoryTotals come from a real database instead of being hard-coded per page.
Build real POST / PUT / DELETE routes for expenses and connect them to ExpenseForm and the delete button, which currently only update local React state.
Replace the placeholder Reports numbers with real totals calculated from persisted expense data.