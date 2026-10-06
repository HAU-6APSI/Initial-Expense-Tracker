import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
} from "lucide-react";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/expenses",
    label: "Expenses",
    icon: Receipt,
  },
  {
    to: "/budget",
    label: "Budget",
    icon: Wallet,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: PieChart,
  },
];

export default function Navbar() {
  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-[#2A2107] font-serif font-bold">
              ₱
            </div>

            <div className="hidden sm:block">
              <div className="font-serif font-semibold text-lg leading-none">
                Spendwise
              </div>

              <div className="text-[10px] uppercase tracking-[0.18em] text-white/55 mt-1">
                Student expense tracker
              </div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            {links.map(
              ({
                to,
                label,
                icon: Icon,
                end,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-2
                    px-3 sm:px-4
                    py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    ${
                      isActive
                        ? "bg-white text-primary shadow-sm"
                        : "text-white/65 hover:text-white hover:bg-white/10"
                    }
                  `
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={2.25}
                  />

                  <span className="hidden md:block">
                    {label}
                  </span>
                </NavLink>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}