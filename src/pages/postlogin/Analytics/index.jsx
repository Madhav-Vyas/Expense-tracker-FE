import React, { useState } from "react";
import { IconChevronDown, IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import AnalyticsDashboard from "../dashboard/components/AnalyticsDashboard";
import { MONTHS_LIST } from "../../../constants/dateConstants";

/**
 * Dedicated Analytics Page
 * In-depth financial analytics cockpit supporting Light & Dark modes:
 * - Dynamic Month/Year filters.
 * - Deep Category breakdown with SVG progress rings.
 * - 50/30/20 budget allocations with live target limits.
 * - Itemized Indian Convenience Tax (Swiggy, Zomato, Cabs) transaction list.
 * - Emergency Runway calculations, Burn Rate Simulator slider, and Projected bills timeline.
 */
const AnalyticsPage = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  return (
    <div className="w-full space-y-8 animate-fade-in pb-16">
      {/* Header with Navigation & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs"
              title="Back to Dashboard"
            >
              <IconArrowLeft size={16} />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Financial Analytics
            </h1>
            <span className="p-1 px-2.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
              Deep Audit
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Detailed insights into category allocations, lifestyle convenience costs, and cash runway projections.
          </p>
        </div>

        {/* Date Selector Header Bar */}
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-xs">
          {/* Month Select */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="appearance-none bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-white font-semibold text-xs px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-violet-500 transition-colors shadow-xs cursor-pointer"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value} className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
              <IconChevronDown size={12} />
            </div>
          </div>

          {/* Year Select */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-white font-semibold text-xs px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-violet-500 transition-colors shadow-xs cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y} className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
              <IconChevronDown size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Expanded Analytics Cockpit */}
      <div className="w-full">
        <AnalyticsDashboard selectedMonth={selectedMonth} selectedYear={selectedYear} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
