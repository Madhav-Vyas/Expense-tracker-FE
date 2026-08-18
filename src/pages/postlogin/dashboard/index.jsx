import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  IconPlus,
  IconWallet,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPigMoney,
  IconChartPie,
  IconArrowRight,
  IconHourglassLow,
  IconCoffee,
} from "@tabler/icons-react";
import AddEditTransactionModal from "../../../components/AddEditTransactionModal";
import QuickTransactionBar from "../../../components/QuickTransactionBar";
import LatestTransactionTable from "./components/LatestTransactionTable";
import { getCategoryMeta } from "../../../utils/autoCategorizer";
import {
  getAnalyticsSummary,
  getAnalyticsForecast,
  getAnalyticsLifestyle,
} from "../../../api/transactionAPIs";
import useAuthStore from "../../../hooks/useAuthStore";

/**
 * Dashboard Component (Overview)
 * Clean, operational dashboard with seamless Light & Dark themes:
 * - 4 Core Financial Summary Cards.
 * - Quick Transaction Bar for instant entry.
 * - Simple Category Breakdown Widget with quick link to /analytics.
 * - Latest Transactions Table.
 */
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Queries for current month
  const summaryQuery = useQuery({
    queryKey: ["analytics", "summary", currentYear, currentMonth],
    queryFn: () => getAnalyticsSummary({ year: currentYear, month: currentMonth }),
  });

  const forecastQuery = useQuery({
    queryKey: ["analytics", "forecast", currentYear, currentMonth],
    queryFn: () => getAnalyticsForecast({ year: currentYear, month: currentMonth }),
  });

  const lifestyleQuery = useQuery({
    queryKey: ["analytics", "lifestyle", currentYear, currentMonth],
    queryFn: () => getAnalyticsLifestyle({ year: currentYear, month: currentMonth }),
  });

  const summary = summaryQuery.data?.data;
  const forecast = forecastQuery.data?.data;
  const lifestyle = lifestyleQuery.data?.data;

  // Format currency helpers
  const formatUSD = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const netSavings = summary?.netSavings || 0;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  const momGrowth = lifestyle?.compareLastMonth?.growthPercentage || 0;
  const expenseChangeText =
    momGrowth > 0
      ? `+${momGrowth}% vs last month`
      : momGrowth < 0
      ? `${momGrowth}% vs last month`
      : "0% vs last month";

  const metrics = [
    {
      title: "Total Balance",
      amount: formatUSD(forecast?.surplusBalance),
      change: "Lifetime reserve surplus",
      isPositive: true,
      icon: IconWallet,
      glowColor: "from-violet-500/20 to-cyan-500/20",
      iconColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
    },
    {
      title: "Monthly Income",
      amount: formatUSD(totalIncome),
      change: "Current month inflow",
      isPositive: true,
      icon: IconTrendingUp,
      glowColor: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    },
    {
      title: "Monthly Expenses",
      amount: formatUSD(totalExpense),
      change: expenseChangeText,
      isPositive: momGrowth <= 0,
      icon: IconTrendingDown,
      glowColor: "from-rose-500/20 to-orange-500/20",
      iconColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
    },
    {
      title: "Net Savings",
      amount: formatUSD(netSavings),
      change: `${savingsRate}% savings rate`,
      isPositive: netSavings >= 0,
      icon: IconPigMoney,
      glowColor: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20",
    },
  ];

  const categoriesBreakdown = summary?.categoryBreakdown || [];

  return (
    <div className="w-full space-y-7 animate-fade-in pb-12">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "there"}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Here is your daily financial summary and cash flow overview.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-md shadow-violet-600/20 hover:shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <IconPlus size={15} className="stroke-[3]" />
            <span>Full Form Entry</span>
          </button>
        </div>
      </div>

      {/* 4-Card Hero Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm dark:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${metric.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="flex items-center justify-between relative">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {metric.title}
                </span>
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${metric.iconColor}`}
                >
                  <Icon size={18} className="stroke-[2.5]" />
                </span>
              </div>

              <div className="mt-4 relative">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {summaryQuery.isLoading || forecastQuery.isLoading ? (
                    <span className="text-slate-400 dark:text-slate-500 animate-pulse text-lg">Calculating...</span>
                  ) : (
                    metric.amount
                  )}
                </span>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {metric.isPositive ? (
                    <IconArrowUpRight size={13} className="text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  ) : (
                    <IconArrowDownRight size={13} className="text-rose-600 dark:text-rose-400 stroke-[3]" />
                  )}
                  <span
                    className={
                      metric.isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Transaction Bar */}
      <div className="w-full">
        <QuickTransactionBar />
      </div>

      {/* Simple Category Summary Widget + Deep Analytics Link Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Simple Category Distribution (2 Cols) */}
        <div className="lg:col-span-2 relative overflow-hidden bg-white/80 dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
                <IconChartPie size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Category Summary</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Top spending areas this month</p>
              </div>
            </div>

            <Link
              to="/analytics"
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 group"
            >
              <span>View Deep Analytics</span>
              <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {categoriesBreakdown.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No expenses logged yet this month</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">Use the quick log bar above to record your first transaction.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categoriesBreakdown.slice(0, 4).map((cat, idx) => {
                const meta = getCategoryMeta(cat.category);
                const strokeColorClass = meta.color
                  ? meta.color.split(" ")[0].replace("from-", "stroke-")
                  : "stroke-slate-500";

                const radius = 18;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (cat.percentage / 100) * circumference;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-10 h-10 transform -rotate-90">
                          <circle
                            cx="20"
                            cy="20"
                            r={radius}
                            className="stroke-slate-200 dark:stroke-slate-800"
                            strokeWidth="3"
                            fill="transparent"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r={radius}
                            className={`${strokeColorClass} transition-all duration-700`}
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-xs">{meta.icon || "🏷️"}</span>
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.category}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{cat.percentage}% of outflow</p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-slate-900 dark:text-white">{formatUSD(cat.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Quick Insights & Navigation Card (1 Col) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-violet-50/40 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-violet-950/20 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-black tracking-widest text-violet-600 dark:text-violet-400 uppercase">
              Financial Health
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Want deeper insights?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Explore your 50/30/20 rule allocation, audit convenience tax (Swiggy/Uber), and simulate runway burn rates.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/50 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <IconCoffee size={14} className="text-amber-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Convenience Tax</span>
                </div>
                <span className="font-black text-amber-600 dark:text-amber-400">
                  {formatINR(lifestyle?.convenienceTax?.totalConvenience || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/50 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <IconHourglassLow size={14} className="text-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Cash Runway</span>
                </div>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  {forecast?.runwayMonths || 0} Months
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/analytics"
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Open Analytics Dashboard</span>
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Transactions Activity Feed */}
      <div className="w-full">
        <LatestTransactionTable />
      </div>

      {/* Full Form Entry Modal */}
      <AddEditTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log("Transaction data submitted from dashboard:", data);
        }}
      />
    </div>
  );
};

export default Dashboard;
