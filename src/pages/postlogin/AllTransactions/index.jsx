import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "../../../api/transactionAPIs";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconInbox,
  IconChevronLeft,
  IconChevronRight,
  IconReceipt,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import AddEditTransactionModal from "../../../components/AddEditTransactionModal";

/**
 * AllTransactions Component
 * Renders all transactions with a premium table, filtering indicators,
 * and page-by-page offset pagination.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
const AllTransactions = () => {
  const [page, setPage] = useState(1);
  const limit = 8; // Showing 8 transactions per page for a dedicated history view
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
  const allTransQuery = useQuery({
    queryKey: ["allTrans", page, type, debouncedSearch],
    queryFn: () =>
      getAllTransactions({ page, limit, type, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const { data, isLoading, isError, error } = allTransQuery;
  const pagination = data?.pagination;
  const transactions = data?.data?.transactions || [];

  const handleTypeChange = (newType) => {
    setType(newType);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);

    setPage(1);
  };
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
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <IconReceipt size={28} />
            </span>
            Transaction Ledger
          </h1>
          <p className="text-slate-400 text-sm">
            A complete history of your incoming and outgoing transactions.
          </p>
        </div>

        {/* Add Transaction Button */}
        <div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold rounded-xl text-xs shadow-lg shadow-violet-600/15 hover:shadow-violet-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <IconPlus size={14} className="stroke-[3]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 blur-3xl -z-10 rounded-full" />

        {/* Tab Filters & Search Bar */}
        <div className="flex border-b border-slate-800/50 pb-5 mb-5 items-center justify-between gap-4 flex-wrap">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 pointer-events-none">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by description..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-800 bg-slate-950/80 text-white rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 focus:outline-none transition-all placeholder-slate-600 text-sm"
            />
          </div>

          {/* Type Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 max-w-fit">
            <button
              onClick={() => handleTypeChange("")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                type === ""
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => handleTypeChange("income")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                type === "income"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-sm"
                  : "text-slate-400 hover:text-emerald-400"
              }`}
            >
              Income Only
            </button>
            <button
              onClick={() => handleTypeChange("expense")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                type === "expense"
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/10 shadow-sm"
                  : "text-slate-400 hover:text-rose-400"
              }`}
            >
              Expenses Only
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-medium animate-pulse">
              Loading ledger data...
            </p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12 text-rose-500/90 text-sm bg-rose-500/5 border border-rose-500/10 rounded-xl p-6">
            <p className="font-semibold text-base">
              Failed to fetch transactions
            </p>
            <p className="text-xs text-rose-500/60 mt-1">
              {error?.message || "An unexpected error occurred."}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-slate-600 mb-3 border border-slate-800/50">
              <IconInbox size={26} />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              No transactions recorded
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
              Once you add an income or expense, your ledger will update here.
            </p>
          </div>
        )}

        {/* Transactions list */}
        {!isLoading && !isError && transactions.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-1 divide-y divide-slate-800/30">
              {transactions.map((transaction) => {
                const isExpense = transaction.type === "expense";
                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-800/35 -mx-2 rounded-xl transition-all group duration-200"
                  >
                    {/* Left part: Icon & Details */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-[1.03] ${
                          isExpense
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        }`}
                      >
                        {isExpense ? (
                          <IconTrendingDown
                            size={20}
                            className="stroke-[2.5]"
                          />
                        ) : (
                          <IconTrendingUp size={20} className="stroke-[2.5]" />
                        )}
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors capitalize truncate max-w-[180px] sm:max-w-[320px]">
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
                        {isExpense ? "-" : "+"}{" "}
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-2 border-t border-slate-800/50">
                {/* Pagination Info */}
                <div className="text-xs text-slate-400 font-medium">
                  Showing{" "}
                  <span className="text-white">{(page - 1) * limit + 1}</span>{" "}
                  to{" "}
                  <span className="text-white">
                    {Math.min(page * limit, pagination.total)}
                  </span>{" "}
                  of <span className="text-white">{pagination.total}</span>{" "}
                  records
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="p-2 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:bg-slate-950/80 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-all cursor-pointer"
                    title="Previous Page"
                  >
                    <IconChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            page === pageNumber
                              ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                              : "border border-slate-800/80 bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(p + 1, pagination.totalPages))
                    }
                    className="p-2 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:bg-slate-950/80 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-all cursor-pointer"
                    title="Next Page"
                  >
                    <IconChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-out Drawer */}
      <AddEditTransactionModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={(data) => {
          console.log("Transaction data submitted from ledger:", data);
        }}
      />
    </div>
  );
};

export default AllTransactions;
