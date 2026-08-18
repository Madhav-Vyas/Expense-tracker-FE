import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IconX,
  IconCoin,
  IconTrendingDown,
  IconTrendingUp,
  IconSparkles,
  IconPlus,
} from "@tabler/icons-react";
import { ControlledInput } from "./controlled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "../api/transactionAPIs";
import Drawer from "@mui/material/Drawer";
import { CATEGORIES, autoCategorize } from "../utils/autoCategorizer";
import { useAppStore } from "../store/useAppStore";

// Form Validation Schema using Zod
const transactionSchema = z.object({
  description: z
    .string()
    .min(1, "Please provide a description or merchant name")
    .max(120, "Description must be under 120 characters"),
  amount: z
    .number({ invalid_type_error: "Amount is required and must be a number" })
    .positive("Amount must be greater than zero"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be either income or expense" }),
  }),
  category: z.string().min(1, "Please select a category"),
  date: z.string().optional(),
});

/**
 * AddEditTransactionModal Component
 * Full-form drawer with intelligent real-time auto-categorization and dual-theme styles.
 */
const AddEditTransactionModal = ({
  isOpen,
  onClose,
  transaction = null,
  onSubmit,
}) => {
  const queryClient = useQueryClient();
  const { theme } = useAppStore();
  const isDark = theme === "dark";

  const [isManualCategory, setIsManualCategory] = useState(false);
  const [isManualType, setIsManualType] = useState(false);

  const methods = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: "",
      type: "expense",
      category: "Other",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const currentDescription = watch("description");
  const currentCategory = watch("category");
  const currentType = watch("type");
  const currentAmount = watch("amount");

  // Populate data if editing an existing transaction
  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description || "",
        amount: transaction.amount || "",
        type: transaction.type || "expense",
        category: transaction.category || "Other",
        date: transaction.date
          ? new Date(transaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      setIsManualCategory(true);
      setIsManualType(true);
    } else {
      reset({
        description: "",
        amount: "",
        type: "expense",
        category: "Other",
        date: new Date().toISOString().split("T")[0],
      });
      setIsManualCategory(false);
      setIsManualType(false);
    }
  }, [transaction, reset, isOpen]);

  // Real-time auto-categorization on description change
  useEffect(() => {
    if (transaction) return; // Skip if editing
    if (!currentDescription || !currentDescription.trim()) {
      if (!isManualCategory) setValue("category", "Other");
      if (!isManualType) setValue("type", "expense");
      return;
    }

    const prediction = autoCategorize(currentDescription);

    if (!isManualCategory && prediction.isAutoDetected) {
      setValue("category", prediction.category);
    }

    if (!isManualType && prediction.isAutoDetected) {
      setValue("type", prediction.type);
    }
  }, [currentDescription, isManualCategory, isManualType, setValue, transaction]);

  // Mutation to save transaction
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await addTransaction(data);
    },
    onSuccess: (savedData) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["allTrans"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      if (onSubmit) onSubmit(savedData);
      onClose();
      reset();
    },
    onError: (error) => {
      console.error("Failed to save transaction:", error);
    },
  });

  const { isPending } = mutation;

  const onSubmitHandler = (data) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
    };
    if (onSubmit && typeof onSubmit === "function") {
      mutation.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  };

  const handleQuickAmount = (addedVal) => {
    const currentVal = parseFloat(currentAmount) || 0;
    setValue("amount", currentVal + addedVal, { shouldValidate: true });
  };

  const isEditMode = !!transaction;
  const currentCategoryMeta = CATEGORIES.find((c) => c.id === currentCategory) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        backdrop: {
          className: "bg-slate-950/50!",
          style: { backgroundColor: "rgba(2, 6, 23, 0.5)" },
        },
        paper: {
          className: "w-full max-w-md bg-white! dark:bg-slate-900! border-l border-slate-200 dark:border-slate-800/80! p-6 shadow-2xl flex flex-col h-full overflow-y-auto text-slate-900 dark:text-white relative transition-colors duration-200",
          style: {
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            color: isDark ? "#ffffff" : "#0f172a",
            borderColor: isDark ? "#1e293b" : "#e2e8f0",
          },
        },
      }}
    >
      {/* Decorative Top Glow */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[70px] opacity-20 dark:opacity-40 pointer-events-none transition-colors duration-500 ${
          currentType === "expense" ? "bg-rose-500" : "bg-emerald-500"
        }`}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
        title="Close modal"
      >
        <IconX size={18} />
      </button>

      {/* Modal Header */}
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span
            className={`p-2 rounded-xl ${
              isEditMode
                ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20"
                : "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20"
            }`}
          >
            <IconCoin size={20} />
          </span>
          {isEditMode ? "Edit Transaction" : "New Transaction"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {isEditMode
            ? "Update transaction details."
            : "Quickly record a financial movement (auto-timestamped to now)."}
        </p>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
          {/* Transaction Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Expense Option */}
              <button
                type="button"
                onClick={() => {
                  setValue("type", "expense");
                  setIsManualType(true);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
                  currentType === "expense"
                    ? "bg-rose-50 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <IconTrendingDown
                  size={18}
                  className={
                    currentType === "expense"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-400 dark:text-slate-500"
                  }
                />
                <span>Expense</span>
              </button>

              {/* Income Option */}
              <button
                type="button"
                onClick={() => {
                  setValue("type", "income");
                  setIsManualType(true);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
                  currentType === "income"
                    ? "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <IconTrendingUp
                  size={18}
                  className={
                    currentType === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }
                />
                <span>Income</span>
              </button>
            </div>
            {errors.type && (
              <span className="text-[11px] text-rose-500 block mt-1 font-medium">
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Streamlined Single Text Field */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                What was this for?
              </label>
              {currentCategoryMeta && currentCategory !== "Other" && (
                <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                  <IconSparkles size={12} className="text-amber-500" />
                  Auto-tagged: {currentCategory}
                </span>
              )}
            </div>
            <div className="relative">
              <ControlledInput
                name="description"
                placeholder="e.g. Starbucks iced coffee, Uber to airport, Monthly Salary"
                autoFocus
              />
            </div>
          </div>

          {/* Amount Field + Quick Denomination Chips */}
          <div className="space-y-2">
            <ControlledInput
              name="amount"
              label="Amount"
              type="number"
              step="any"
              placeholder="0.00"
              icon={IconCoin}
            />

            {/* Quick Amount Increment Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase mr-1">Quick:</span>
              {[10, 20, 50, 100, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Category
              </label>
              <span className="text-[11px] text-slate-500">
                1-tap to switch
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80">
              {CATEGORIES.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setValue("category", cat.id);
                      setIsManualCategory(true);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-violet-100 dark:bg-violet-600/20 border-violet-300 dark:border-violet-500 text-violet-900 dark:text-white shadow-xs scale-[1.02]"
                        : "bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-lg mb-1">{cat.icon}</span>
                    <span className="text-[11px] truncate w-full text-center">{cat.id}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <span className="text-[11px] text-rose-500 block mt-1 font-medium">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all cursor-pointer text-center text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5 ${
                currentType === "expense"
                  ? "bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-rose-600/20"
                  : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/20"
              } hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50`}
            >
              {isSubmitting || isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                <>
                  <IconPlus size={16} className="stroke-[3]" />
                  <span>Add Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default AddEditTransactionModal;
