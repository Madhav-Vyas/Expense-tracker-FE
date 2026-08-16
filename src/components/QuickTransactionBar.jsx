import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IconBolt,
  IconPlus,
  IconCheck,
  IconTrendingDown,
  IconTrendingUp,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { addTransaction } from "../api/transactionAPIs";
import { CATEGORIES, autoCategorize } from "../utils/autoCategorizer";

/**
 * QuickTransactionBar Component
 * Allows users to register a transaction in under 2 seconds.
 * Automatically timestamps to current date/time and predicts category & type in real-time.
 */
export default function QuickTransactionBar({ onTransactionAdded }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("Other");
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [isManualType, setIsManualType] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const queryClient = useQueryClient();

  // Run real-time auto-categorization when title changes
  useEffect(() => {
    if (!title.trim()) {
      if (!isManualCategory) setSelectedCategory("Other");
      if (!isManualType) setSelectedType("expense");
      return;
    }

    const prediction = autoCategorize(title);

    if (!isManualCategory && prediction.isAutoDetected) {
      setSelectedCategory(prediction.category);
    }

    if (!isManualType && prediction.isAutoDetected) {
      setSelectedType(prediction.type);
    }
  }, [title, isManualCategory, isManualType]);

  const addMutation = useMutation({
    mutationFn: (data) => addTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["allTrans"] });
      
      // Visual feedback
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      // Reset form
      setTitle("");
      setAmount("");
      setSelectedCategory("Other");
      setSelectedType("expense");
      setIsManualCategory(false);
      setIsManualType(false);
      setErrorMsg("");

      if (onTransactionAdded) onTransactionAdded();
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to add transaction");
    },
  });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Please enter what the transaction was for");
      return;
    }

    addMutation.mutate({
      description: title.trim(),
      amount: numAmount,
      type: selectedType,
      category: selectedCategory,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !showCategoryPicker) {
      handleSubmit(e);
    }
  };

  const currentCategoryMeta =
    CATEGORIES.find((c) => c.id === selectedCategory) ||
    CATEGORIES.find((c) => c.id === "Other");

  return (
    <div className="w-full relative group">
      {/* Background ambient glow */}
      <div
        className={`absolute -inset-0.5 rounded-2xl blur-lg opacity-40 transition-all duration-500 ${
          selectedType === "income"
            ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/20"
            : "bg-gradient-to-r from-violet-600/30 to-rose-500/20"
        }`}
      />

      <div className="relative w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl transition-all">
        {/* Top Header Bar inside card */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <IconBolt size={14} className="stroke-[2.5]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Log
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              • Auto-categorized & timestamped to now
            </span>
          </div>

          {/* Type Toggle: Expense / Income */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedType("expense");
                setIsManualType(true);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                selectedType === "expense"
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <IconTrendingDown size={13} />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType("income");
                setIsManualType(true);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                selectedType === "income"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <IconTrendingUp size={13} />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Input Row */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main Title/Memo Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsManualCategory(false);
                setIsManualType(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="What was this for? (e.g. Starbucks, Uber, Monthly Salary)"
              className="w-full bg-slate-950/90 text-white placeholder-slate-500 text-sm font-medium px-4 py-3 rounded-xl border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 focus:outline-none transition-all"
            />
          </div>

          {/* Amount Input */}
          <div className="w-full sm:w-40 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full bg-slate-950/90 text-white font-bold text-sm pl-8 pr-3 py-3 rounded-xl border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 focus:outline-none transition-all"
            />
          </div>

          {/* Auto-detected Category Tag / Selector Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3.5 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${
                currentCategoryMeta.badgeBg
              } hover:brightness-110`}
              title="Click to change category"
            >
              <span className="text-base">{currentCategoryMeta.icon}</span>
              <span className="truncate max-w-[110px]">{currentCategoryMeta.label}</span>
              <IconSparkles size={13} className="text-amber-400 animate-pulse" />
            </button>

            {/* Category Dropdown Popover */}
            {showCategoryPicker && (
              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl z-50 animate-fade-in">
                <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Select Category</span>
                  <button
                    type="button"
                    onClick={() => setShowCategoryPicker(false)}
                    className="text-slate-500 hover:text-white p-0.5"
                  >
                    <IconX size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsManualCategory(true);
                        setShowCategoryPicker(false);
                      }}
                      className={`flex items-center gap-1.5 p-2 rounded-lg text-left text-xs font-medium transition-all ${
                        selectedCategory === cat.id
                          ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Submit Button */}
          <button
            type="submit"
            disabled={addMutation.isPending}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              justAdded
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : selectedType === "income"
                ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-violet-600/20 hover:scale-[1.02] active:scale-[0.98]"
            } disabled:opacity-50`}
          >
            {addMutation.isPending ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : justAdded ? (
              <>
                <IconCheck size={16} />
                <span>Recorded!</span>
              </>
            ) : (
              <>
                <IconPlus size={16} className="stroke-[3]" />
                <span>Quick Log</span>
              </>
            )}
          </button>
        </form>

        {/* Error message */}
        {errorMsg && (
          <p className="text-[11px] font-semibold text-rose-400 mt-2 animate-fade-in">
            ⚠️ {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
