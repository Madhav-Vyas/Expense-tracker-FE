import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "../../../../api/transactionAPIs";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconHistory,
  IconInbox,
} from "@tabler/icons-react";

/**
 * LatestTransactionTable Component
 * Shows recent transactions in a modern, row-based dark card layout
 * with color coding for income (green) and expense (red).
 */
const LatestTransactionTable = () => {
  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllTransactions(),
  });

  const { data, isLoading, error } = transactionsQuery;

  // Format date helper (e.g. "Jul 13, 2026")
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  // Format currency helper (e.g. "$125.00")
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="mt-10 w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative internal glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-2xl -z-10 rounded-full" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800/50">
        <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
          <IconHistory size={18} />
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Latest Transactions
        </h2>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium animate-pulse">
            Fetching history...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8 text-rose-500/90 text-sm bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
          <p className="font-semibold">Failed to load transactions</p>
          <p className="text-xs text-rose-500/60 mt-1">{error.message}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading &&
        !error &&
        (!data?.data?.transactions || data.data.transactions.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-slate-600 mb-3 border border-slate-800/50">
              <IconInbox size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              No activity yet
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Add your first income or expense to see it listed here.
            </p>
          </div>
        )}

      {/* Transactions list */}
      {!isLoading &&
        !error &&
        data?.data?.transactions &&
        data.data.transactions.length > 0 && (
          <div className="space-y-1 divide-y divide-slate-800/30">
            {data.data.transactions.slice(0, 5).map((transaction) => {
              const isExpense = transaction.type === "expense";
              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between py-3 px-1 hover:bg-slate-800/35 -mx-1 rounded-xl transition-all group duration-200"
                >
                  {/* Left part: Icon & Details */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-[1.03] ${
                        isExpense
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                      }`}
                    >
                      {isExpense ? (
                        <IconTrendingDown size={18} className="stroke-[2.5]" />
                      ) : (
                        <IconTrendingUp size={18} className="stroke-[2.5]" />
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors capitalize truncate max-w-[200px] sm:max-w-[300px]">
                        {transaction.description ||
                          (isExpense ? "Expense" : "Income")}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  {/* Right part: Amount */}
                  <div className="text-right pl-4">
                    <span
                      className={`text-sm font-bold tracking-tight ${
                        isExpense ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {isExpense ? "-" : "+"} {formatAmount(transaction.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default LatestTransactionTable;
