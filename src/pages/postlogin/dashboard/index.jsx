import React, { useState } from "react";
import {
  IconPlus,
  IconWallet,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import AddEditTransactionModal from "../../../components/AddEditTransactionModal";
import LatestTransactionTable from "./components/LatestTransactionTable";

/**
 * Dashboard Component
 * Designed with a premium grid layout consisting of a header row,
 * metrics analytics cards, and a full-width recent transactions list.
 */
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy analytics data
  const metrics = [
    {
      title: "Total Balance",
      amount: "$12,450.00",
      change: "+8.2% vs last month",
      isPositive: true,
      icon: IconWallet,
      glowColor: "from-violet-600/10 to-cyan-500/10",
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/10",
    },
    {
      title: "Monthly Income",
      amount: "$8,200.00",
      change: "+12.4% vs last month",
      isPositive: true,
      icon: IconTrendingUp,
      glowColor: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10",
    },
    {
      title: "Monthly Expenses",
      amount: "$3,750.00",
      change: "-3.1% vs last month",
      isPositive: true, // positive context: expenses reduced
      icon: IconTrendingDown,
      glowColor: "from-rose-500/10 to-orange-500/10",
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/10",
    },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Welcome back! Here is a summary of your financial flow.
          </p>
        </div>

        {/* Small Add Transaction Button */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold rounded-xl text-xs shadow-lg shadow-violet-600/15 hover:shadow-violet-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <IconPlus size={14} className="stroke-[3]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300 group"
            >
              {/* Background card glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${metric.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="flex items-center justify-between relative">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {metric.title}
                </span>
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${metric.iconColor}`}
                >
                  <Icon size={16} />
                </span>
              </div>

              <div className="mt-4 relative">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {metric.amount}
                </span>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-slate-500">
                  {metric.isPositive ? (
                    <IconArrowUpRight size={12} className="text-emerald-400" />
                  ) : (
                    <IconArrowDownRight size={12} className="text-rose-400" />
                  )}
                  <span
                    className={
                      metric.isPositive ? "text-emerald-400" : "text-rose-400"
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

      {/* Full-width Transactions Section */}
      <div className="w-full">
        <LatestTransactionTable />
      </div>

      {/* Modal */}
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
