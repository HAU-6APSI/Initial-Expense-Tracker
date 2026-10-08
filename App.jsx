import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/organisms/Navbar";
import { isBrowserStorageMode } from "./services/api";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {isBrowserStorageMode && (
        <div className="bg-accent/15 px-4 py-2 text-center text-xs text-ink">
          Saved on this browser and device only. It will not sync to other devices.
        </div>
      )}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
