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
  IconTag,
  IconPlus,
} from "@tabler/icons-react";
import { ControlledInput } from "./controlled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "../api/transactionAPIs";
import Drawer from "@mui/material/Drawer";
import { CATEGORIES, autoCategorize } from "../utils/autoCategorizer";

// Form Validation Schema using Zod
const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  category: z.enum([
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Other",
  ], {
    required_error: "Category is required",
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().min(1, "Please specify what this transaction was for"),
});

/**
 * AddEditTransactionModal component
 * Fast transaction recording with real-time auto-categorization,
 * automated timestamping, and quick denomination chips.
 */
const AddEditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onSubmit,
}) => {
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [isManualType, setIsManualType] = useState(false);

  const methods = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      category: "Other",
      amount: "",
      description: "",
    },
  });

  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const currentType = watch("type");
  const currentCategory = watch("category");
  const currentDescription = watch("description");
  const currentAmount = watch("amount");

  // Real-time Fuse.js auto-categorization as user types
  useEffect(() => {
    if (!isOpen || transaction) return;
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
  }, [currentDescription, isManualCategory, isManualType, setValue, isOpen, transaction]);

  // Reset form values when transaction or modal visibility changes
  useEffect(() => {
    if (isOpen) {
      setIsManualCategory(false);
      setIsManualType(false);
      if (transaction) {
        reset({
          type: transaction.type || "expense",
          category: transaction.category || "Other",
          amount: transaction.amount || "",
          description: transaction.description || "",
        });
      } else {
        reset({
          type: "expense",
          category: "Other",
          amount: "",
          description: "",
        });
      }
    }
  }, [transaction, isOpen, reset]);

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const queryClient = useQueryClient();

  const addTransactionMutation = useMutation({
    mutationFn: (val) => addTransaction(val),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["allTrans"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      onClose();
    },
    onError: (err) => console.log(err),
  });

  const { isPending } = addTransactionMutation;

  const onSubmitHandler = (values) => {
    if (onSubmit) {
      addTransactionMutation.mutate(values);
    } else {
      onClose();
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
          className: "w-full max-w-md bg-slate-900! border-l border-slate-800/80! p-6 shadow-2xl flex flex-col h-full overflow-y-auto text-white relative",
          style: { backgroundColor: "#0f172a", color: "#fff", borderColor: "#1e293b" },
        },
      }}
    >
      {/* Decorative Top Glow */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[70px] opacity-40 pointer-events-none transition-colors duration-500 ${
          currentType === "expense" ? "bg-rose-500" : "bg-emerald-500"
        }`}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
        title="Close modal"
      >
        <IconX size={18} />
      </button>

      {/* Modal Header */}
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <span
            className={`p-2 rounded-xl ${
              isEditMode
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            }`}
          >
            <IconCoin size={20} />
          </span>
          {isEditMode ? "Edit Transaction" : "New Transaction"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
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
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
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
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
                  currentType === "expense"
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-400 ring-2 ring-rose-500/20 shadow-lg shadow-rose-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                }`}
              >
                <IconTrendingDown
                  size={18}
                  className={
                    currentType === "expense"
                      ? "text-rose-400"
                      : "text-slate-500"
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
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
                  currentType === "income"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                }`}
              >
                <IconTrendingUp
                  size={18}
                  className={
                    currentType === "income"
                      ? "text-emerald-400"
                      : "text-slate-500"
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
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                What was this for?
              </label>
              {currentCategoryMeta && currentCategory !== "Other" && (
                <span className="text-[11px] font-semibold text-violet-400 flex items-center gap-1">
                  <IconSparkles size={12} className="text-amber-400" />
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
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Category
              </label>
              <span className="text-[11px] text-slate-500">
                1-tap to switch
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
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
                        ? "bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-500/10 scale-[1.02]"
                        : "bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
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
              className="flex-1 py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all cursor-pointer text-center text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5 ${
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
