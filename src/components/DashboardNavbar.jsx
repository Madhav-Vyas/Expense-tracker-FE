import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconTrendingUp,
  IconLogout,
  IconLayoutDashboard,
  IconWallet,
  IconChartPie,
  IconSettings,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import useAuthStore from "../hooks/useAuthStore";
import { useAppStore } from "../store/useAppStore";

export function DashboardNavbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDark = theme === "dark";
  const userName = user?.name || "John Doe";
  const realUser = user;
  console.log(realUser);
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="relative z-10 border-b border-slate-500/10 bg-slate-950/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <IconTrendingUp size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            FinFlow
          </span>
          <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-bold tracking-wide uppercase border border-violet-500/20">
            User Portal
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
          <a
            href="#overview"
            className="text-white hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-500/5"
          >
            <IconLayoutDashboard size={16} /> Overview
          </a>
          <a
            href="#wallet"
            className="hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <IconWallet size={16} /> Wallets
          </a>
          <a
            href="#analytics"
            className="hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <IconChartPie size={16} /> Analytics
          </a>
          <a
            href="#settings"
            className="hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <IconSettings size={16} /> Settings
          </a>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-500/10 hover:bg-slate-500/5 transition-all text-slate-400 hover:text-slate-100"
            title="Toggle Theme"
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-sm">
              {userInitials}
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white">{userName}</div>
              <div className="text-[10px] text-slate-500">Premium Member</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <IconLogout size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
