import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsSummary,
  getAnalyticsLifestyle,
  getAnalyticsForecast,
  getAllTransactions,
} from "../../../../api/transactionAPIs";
import { getCategoryMeta } from "../../../../utils/autoCategorizer";
import { MONTHS_LIST } from "../../../../constants/dateConstants";
import {
  IconChartPie,
  IconFingerprint,
  IconHourglassLow,
  IconReceipt,
  IconCoffee,
  IconCar,
  IconBolt,
  IconExclamationCircle,
  IconAlertTriangle,
  IconCheck,
  IconCalendarEvent,
  IconAdjustmentsHorizontal,
  IconShieldCheck,
} from "@tabler/icons-react";

/**
 * AnalyticsDashboard Component
 * Expansive financial command center supporting Light & Dark themes with 3 tiers:
 * - Tier 1: Core Flow & Category Breakdown with multi-segment distribution
 * - Tier 2: 50/30/20 Budgeting Rule & Indian Convenience Tax Audit
 * - Tier 3: Cash Runway, Burn Rate Simulator & Recurring Bill Predictions
 */
const AnalyticsDashboard = ({ selectedMonth, selectedYear }) => {
  const [activeView, setActiveView] = useState("all"); // 'all' | 'categories' | 'budget' | 'forecast'
  const [simulatedBurnRate, setSimulatedBurnRate] = useState(0);

  // Queries bound to year and month
  const summaryQuery = useQuery({
    queryKey: ["analytics", "summary", selectedYear, selectedMonth],
    queryFn: () => getAnalyticsSummary({ year: selectedYear, month: selectedMonth }),
  });

  const lifestyleQuery = useQuery({
    queryKey: ["analytics", "lifestyle", selectedYear, selectedMonth],
    queryFn: () => getAnalyticsLifestyle({ year: selectedYear, month: selectedMonth }),
  });

  const forecastQuery = useQuery({
    queryKey: ["analytics", "forecast", selectedYear, selectedMonth],
    queryFn: () => getAnalyticsForecast({ year: selectedYear, month: selectedMonth }),
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", "all-analytics-list"],
    queryFn: () => getAllTransactions({ limit: 1000 }),
  });

  const isLoading =
    summaryQuery.isLoading ||
    lifestyleQuery.isLoading ||
    forecastQuery.isLoading ||
    transactionsQuery.isLoading;

  const isError =
    summaryQuery.isError ||
    lifestyleQuery.isError ||
    forecastQuery.isError ||
    transactionsQuery.isError;

  const summary = summaryQuery.data?.data;
  const lifestyle = lifestyleQuery.data?.data;
  const forecast = forecastQuery.data?.data;
  const rawTransactions = transactionsQuery.data?.data?.transactions || [];

  const baseBurnRate = forecast?.averageMonthlyExpense || 0;
  useEffect(() => {
    if (baseBurnRate > 0) {
      setSimulatedBurnRate(Math.round(baseBurnRate));
    }
  }, [baseBurnRate]);

  // Currency Helpers
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

  // Convenience keyword matching
  const monthlyTransactions = rawTransactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });

  const deliveryKeywords = ["swiggy", "zomato", "blinkit", "zepto", "instamart", "bigbasket", "dunzo", "eatclub", "dominos", "kfc", "mcdonalds", "pizza hut"];
  const cabKeywords = ["ola", "uber", "rapido", "namma yatri", "indrive", "auto", "taxi", "cab"];

  const convenienceTaxList = monthlyTransactions.filter((t) => {
    if (t.type !== "expense") return false;
    const descLower = (t.description || "").toLowerCase();
    return (
      deliveryKeywords.some((k) => descLower.includes(k)) ||
      cabKeywords.some((k) => descLower.includes(k))
    );
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-14 bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-200/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/80"></div>
          <div className="h-44 bg-slate-200/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/80"></div>
          <div className="h-44 bg-slate-200/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/80"></div>
        </div>
        <div className="h-80 bg-slate-200/40 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800/80"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-16 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 rounded-3xl p-8 backdrop-blur-xl">
        <IconExclamationCircle className="mx-auto text-rose-500 dark:text-rose-400 mb-3" size={42} />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Engine Offline</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Unable to fetch real-time financial metrics. Ensure your backend server is connected and MongoDB is running.
        </p>
      </div>
    );
  }

  const surplusBalance = forecast?.surplusBalance || 0;
  let simulatedRunway = 0;
  if (simulatedBurnRate > 0) {
    simulatedRunway = parseFloat((surplusBalance / simulatedBurnRate).toFixed(1));
  } else if (surplusBalance > 0) {
    simulatedRunway = 99;
  }

  const totalExpense = summary?.totalExpense || 0;
  const totalIncome = summary?.totalIncome || 0;
  const netSavings = summary?.netSavings || 0;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  const budgetNeeds = lifestyle?.budget503020?.needs || { amount: 0, percentage: 0 };
  const budgetWants = lifestyle?.budget503020?.wants || { amount: 0, percentage: 0 };
  const budgetInvestments = lifestyle?.budget503020?.investments || { amount: 0, percentage: 0 };
  const categoriesBreakdown = summary?.categoryBreakdown || [];

  const currentMonthLabel = MONTHS_LIST.find((m) => m.value === selectedMonth)?.label || "Month";

  return (
    <div className="w-full space-y-7">
      {/* Visual Navigation Bar for View Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800/80 p-2.5 rounded-2xl backdrop-blur-xl shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: "Executive Overview", icon: IconAdjustmentsHorizontal },
            { id: "categories", label: "Category Breakdown", icon: IconChartPie },
            { id: "budget", label: "50/30/20 & Convenience", icon: IconFingerprint },
            { id: "forecast", label: "Runway & Predictions", icon: IconHourglassLow },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 px-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentMonthLabel} {selectedYear} Live Audit</span>
        </div>
      </div>

      {/* SECTION 1: EXPANDED CATEGORY BREAKDOWN (Shown in 'all' or 'categories') */}
      {(activeView === "all" || activeView === "categories") && (
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-2xl backdrop-blur-xl transition-colors duration-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-slate-100 dark:border-slate-800/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
                <IconChartPie size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Category Breakdown & Outflow Analysis
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Percentage distribution and absolute spending weight per bucket
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Total Outflow</span>
                <span className="text-lg font-black text-rose-600 dark:text-rose-400">{formatUSD(totalExpense)}</span>
              </div>
            </div>
          </div>

          {/* Multi-segment stacked distribution progress bar */}
          {categoriesBreakdown.length > 0 && (
            <div className="space-y-2 mb-7">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>Expense Distribution Share</span>
                <span>{categoriesBreakdown.length} Categories</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800 shadow-inner">
                {categoriesBreakdown.map((cat, idx) => {
                  const colors = [
                    "bg-amber-500", "bg-blue-500", "bg-purple-500", "bg-rose-500",
                    "bg-yellow-500", "bg-emerald-500", "bg-indigo-500", "bg-teal-500",
                    "bg-violet-500", "bg-pink-500", "bg-slate-500"
                  ];
                  const segmentColor = colors[idx % colors.length];
                  return (
                    <div
                      key={idx}
                      style={{ width: `${cat.percentage}%` }}
                      title={`${cat.category}: ${cat.percentage}% (${formatUSD(cat.amount)})`}
                      className={`${segmentColor} hover:brightness-110 transition-all duration-300 relative group cursor-pointer`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Cards Grid */}
          {categoriesBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl mb-3">
                📊
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Expenses Recorded for {currentMonthLabel}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm font-medium">
                Add standard expenses using the quick logger to view category allocations in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesBreakdown.map((cat, idx) => {
                const meta = getCategoryMeta(cat.category);
                const strokeColorClass = meta.color
                  ? meta.color.split(" ")[0].replace("from-", "stroke-")
                  : "stroke-slate-500";

                const radius = 22;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (cat.percentage / 100) * circumference;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.01] transition-all duration-200 group shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* SVG Circular Progress Ring */}
                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            className="stroke-slate-200 dark:stroke-slate-800/80"
                            strokeWidth="3.5"
                            fill="transparent"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            className={`${strokeColorClass} transition-all duration-700`}
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-base">{meta.icon || "🏷️"}</span>
                      </div>

                      <div className="text-left space-y-0.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                          {cat.category}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-500">
                          {cat.percentage}% of month total
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {formatUSD(cat.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: 50/30/20 BUDGETING & CONVENIENCE TAX (Shown in 'all' or 'budget') */}
      {(activeView === "all" || activeView === "budget") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* 50/30/20 Budgeting Card (7 Cols) */}
          <div className="lg:col-span-7 relative overflow-hidden bg-white/80 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors duration-200">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[90px] pointer-events-none -z-10 rounded-full" />

            <div>
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                    <IconFingerprint size={22} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      50/30/20 Budgeting Rule
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Needs vs. Wants vs. Savings benchmark analysis
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-3 py-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold border border-cyan-200 dark:border-cyan-500/20 rounded-lg">
                  Standard Rule
                </span>
              </div>

              {/* 3 Interactive Metric Gauges */}
              <div className="space-y-5">
                {/* Needs */}
                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60 space-y-2.5 shadow-2xs">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Needs (Bills, Health, Domestic Staff)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatUSD(budgetNeeds.amount)}</span>
                      <span className="text-slate-500 dark:text-slate-400">({budgetNeeds.percentage}% / <b className="text-cyan-600 dark:text-cyan-400">50% Target</b>)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200/80 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, budgetNeeds.percentage)}%` }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                    {budgetNeeds.percentage > 50 ? (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                        <IconAlertTriangle size={12} /> Exceeds safe 50% limit by {budgetNeeds.percentage - 50}%
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <IconCheck size={12} /> Within healthy bounds ({50 - budgetNeeds.percentage}% buffer remaining)
                      </span>
                    )}
                    <span>Target: 50%</span>
                  </div>
                </div>

                {/* Wants */}
                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60 space-y-2.5 shadow-2xs">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Wants (Food, Entertainment, Shopping)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatUSD(budgetWants.amount)}</span>
                      <span className="text-slate-500 dark:text-slate-400">({budgetWants.percentage}% / <b className="text-rose-600 dark:text-rose-400">30% Target</b>)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200/80 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, budgetWants.percentage)}%` }}
                      className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-700"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                    {budgetWants.percentage > 30 ? (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                        <IconAlertTriangle size={12} /> Overspending on lifestyle by {budgetWants.percentage - 30}%
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <IconCheck size={12} /> Spending strictly within 30% allowance
                      </span>
                    )}
                    <span>Target: 30%</span>
                  </div>
                </div>

                {/* Investments */}
                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60 space-y-2.5 shadow-2xs">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Investments (SIPs, Gold, Savings)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatUSD(budgetInvestments.amount)}</span>
                      <span className="text-slate-500 dark:text-slate-400">({budgetInvestments.percentage}% / <b className="text-violet-600 dark:text-violet-400">20% Target</b>)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200/80 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, budgetInvestments.percentage)}%` }}
                      className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-700"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                    {budgetInvestments.percentage < 20 ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                        <IconAlertTriangle size={12} /> Below 20% growth target by {20 - budgetInvestments.percentage}%
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <IconCheck size={12} /> Investment target exceeded! Wealth compounding smoothly
                      </span>
                    )}
                    <span>Target: 20%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Rate Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold">Overall Net Monthly Savings:</span>
              <span className={`font-black text-sm ${netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {formatUSD(netSavings)} ({savingsRate}% of Income)
              </span>
            </div>
          </div>

          {/* Indian Convenience Tax Audit Card (5 Cols) */}
          <div className="lg:col-span-5 relative overflow-hidden bg-white/80 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors duration-200">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[90px] pointer-events-none -z-10 rounded-full" />

            <div>
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-lg">
                    🇮🇳
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Convenience Tax
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Swiggy, Zomato, Zepto & Cab spend audit
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-500/20 rounded-lg">
                  Lifestyle Drain
                </span>
              </div>

              {/* Aggregate Total Banner */}
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/70 text-center mb-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                  Total Monthly Convenience Spend
                </span>
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight mt-1 block">
                  {formatINR(lifestyle?.convenienceTax?.totalConvenience || 0)}
                </span>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/50 text-left">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <IconCoffee size={14} />
                    </span>
                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Quick Delivery</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{formatINR(lifestyle?.convenienceTax?.quickCommerce || 0)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <IconCar size={14} />
                    </span>
                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Cabs & Rides</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{formatINR(lifestyle?.convenienceTax?.rideHailing || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convenience Transactions Itemized List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-2">
                  <span>Triggered Transactions</span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">{convenienceTaxList.length} Found</span>
                </div>

                {convenienceTaxList.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-850">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Zero Convenience Spends</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">No delivery apps or cab charges logged this month.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {convenienceTaxList.map((tx) => {
                      const isFood = deliveryKeywords.some((k) => tx.description?.toLowerCase().includes(k));
                      return (
                        <div
                          key={tx._id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`p-1.5 rounded-lg ${isFood ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                              {isFood ? <IconCoffee size={14} /> : <IconCar size={14} />}
                            </span>
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize truncate max-w-[170px]">
                                {tx.description}
                              </p>
                              <p className="text-[9px] text-slate-500 font-medium">
                                {new Date(tx.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                            {formatINR(tx.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-[10px] text-slate-500 font-medium">
                💡 Tip: Cooking 2 more meals a week can save up to ₹4,000/mo in convenience drain.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CASH RUNWAY & RECURRING BILLS FORECAST (Shown in 'all' or 'forecast') */}
      {(activeView === "all" || activeView === "forecast") && (
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-2xl backdrop-blur-xl transition-colors duration-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-slate-100 dark:border-slate-800/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <IconHourglassLow size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Runway Forecast & Recurring Commitments
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Emergency buffer survival estimation and fixed upcoming bill projections
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-3.5 py-1.5 rounded-xl font-bold border ${
                simulatedRunway < 3
                  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                  : simulatedRunway < 6
                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              }`}>
                {simulatedRunway < 3 ? "⚠️ Low Buffer Alert" : simulatedRunway < 6 ? "⚡ Moderate Cushion" : "🛡️ High Financial Security"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: Runway Dial & Simulator (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Metric Card 1: Runway */}
                <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 text-center relative overflow-hidden shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                    Available Emergency Runway
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5 mt-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {simulatedRunway}
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Months</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">
                    At ₹{Math.round(simulatedBurnRate).toLocaleString()}/mo burn
                  </p>
                </div>

                {/* Metric Card 2: Buffer Assets */}
                <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 text-center relative overflow-hidden shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                    Lifetime Cash Surplus
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatUSD(surplusBalance)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">
                    All-time Inflows minus Outflows
                  </p>
                </div>
              </div>

              {/* Interactive Runway Burn Simulator Slider */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconAdjustmentsHorizontal size={16} className="text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Interactive Burn Rate Simulator</span>
                  </div>
                  <span className="text-xs font-black text-violet-600 dark:text-violet-400">
                    {formatINR(simulatedBurnRate)} / month
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Adjust the slider to simulate how altering your monthly living expenditure stretches or contracts your safety cushion:
                </p>

                <div className="pt-2">
                  <input
                    type="range"
                    min={Math.round(baseBurnRate * 0.3) || 5000}
                    max={Math.round(baseBurnRate * 2.5) || 250000}
                    step={500}
                    value={simulatedBurnRate}
                    onChange={(e) => setSimulatedBurnRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-600 dark:accent-violet-500 focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-2">
                    <span>Frugal Living ({formatINR(Math.round(baseBurnRate * 0.3) || 5000)})</span>
                    <span>Actual ({formatINR(Math.round(baseBurnRate))})</span>
                    <span>High Expense ({formatINR(Math.round(baseBurnRate * 2.5) || 250000)})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Projected Next Month Recurring Bills (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50 pb-3">
                <div className="flex items-center gap-2">
                  <IconReceipt size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Projected Upcoming Bills
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  {forecast?.projectedBills?.length || 0} Fixed Bills
                </span>
              </div>

              {(!forecast?.projectedBills || forecast.projectedBills.length === 0) ? (
                <div className="text-center py-10">
                  <IconShieldCheck className="mx-auto text-slate-400 dark:text-slate-600 mb-2" size={28} />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No Recurring Bills Detected</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto font-medium">
                    Rent, utilities, or domestic staff payments from the last 60 days will automatically project here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                  {forecast.projectedBills.map((bill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <IconBolt size={14} className="stroke-[2.5]" />
                        </span>
                        <div className="text-left space-y-0.5">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize truncate max-w-[150px]">
                            {bill.name}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase">
                            <IconCalendarEvent size={10} />
                            <span>{bill.estimatedDue}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {formatINR(bill.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
