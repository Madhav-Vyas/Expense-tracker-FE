import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  IconLogout,
  IconLayoutDashboard,
  IconWallet,
  IconChartPie,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import useAuthStore from "../hooks/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import HisabLogo from "./HisabLogo";

export function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme, toggleTheme } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDark = theme === "dark";
  const userName = user?.name || "John Doe";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pathname = location.pathname;

  return (
    <header className="relative z-10 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center group cursor-pointer"
        >
          <HisabLogo size="md" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              pathname === "/dashboard"
                ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/70 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
            }`}
          >
            <IconLayoutDashboard size={16} /> Overview
          </Link>
          <Link
            to="/all-transactions"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              pathname === "/all-transactions"
                ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/70 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
            }`}
          >
            <IconWallet size={16} /> All Transactions
          </Link>
          <Link
            to="/analytics"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              pathname === "/analytics"
                ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/70 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
            }`}
          >
            <IconChartPie size={16} /> Analytics
          </Link>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
            title="Toggle Theme"
          >
            {isDark ? <IconSun size={17} className="text-amber-400" /> : <IconMoon size={17} className="text-indigo-600" />}
          </button>

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              {userInitials}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white">{userName}</div>
              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Personal Khata</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <IconLogout size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
