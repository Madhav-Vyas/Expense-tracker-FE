import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IconX,
  IconCalendar,
  IconFileText,
  IconCoin,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { ControlledInput } from "./controlled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "../api/transactionAPIs";

// Form Validation Schema using Zod
const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

/**
 * AddEditTransactionModal component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Callback triggered to close the modal
 * @param {Object} [props.transaction] - If provided, the modal operates in Edit mode and populates with this transaction data.
 * @param {Function} [props.onSubmit] - Optional callback containing the submitted data
 */
const AddEditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onSubmit,
}) => {
  const methods = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      date: new Date().toISOString().split("T")[0],
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

  // Reset form values when transaction or modal visibility changes
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        reset({
          type: transaction.type || "expense",
          amount: transaction.amount || "",
          date: transaction.date
            ? new Date(transaction.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: transaction.description || "",
        });
      } else {
        reset({
          type: "expense",
          amount: "",
          date: new Date().toISOString().split("T")[0],
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
      onClose();
    },
    onError: (err) => console.log(err),
  });
  const { isPending } = addTransactionMutation;
  const onSubmitHandler = (values) => {
    console.log("Transaction submit data (React Hook Form + Zod):", values);
    if (onSubmit) {
      addTransactionMutation.mutate(values);
    } else {
      onClose();
    }
  };

  const isEditMode = !!transaction;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl z-10 transition-all duration-300 animate-scale-up">
        {/* Decorative Top Glow */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[60px] opacity-40 pointer-events-none ${
            currentType === "expense" ? "bg-rose-500" : "bg-emerald-500"
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
          title="Close modal"
        >
          <IconX size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                isEditMode
                  ? "bg-violet-500/10 text-violet-400"
                  : "bg-cyan-500/10 text-cyan-400"
              }`}
            >
              <IconCoin size={20} />
            </span>
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEditMode
              ? "Update your transaction details below."
              : "Enter the details of your new income or expense."}
          </p>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            {/* Transaction Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Expense Option */}
                <button
                  type="button"
                  onClick={() => setValue("type", "expense")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
                    currentType === "expense"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400 ring-2 ring-rose-500/20"
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
                  onClick={() => setValue("type", "income")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
                    currentType === "income"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 ring-2 ring-emerald-500/20"
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

            {/* Amount Field */}
            <ControlledInput
              name="amount"
              label="Amount"
              type="number"
              step="any"
              placeholder="0.00"
              icon={IconCoin}
            />

            {/* Date Field */}
            <ControlledInput
              name="date"
              label="Transaction Date"
              type="date"
              icon={IconCalendar}
            />

            {/* Description Field */}
            <div className="space-y-1.5 w-full">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-slate-500">
                  <IconFileText size={18} />
                </div>
                <textarea
                  {...methods.register("description")}
                  placeholder="Add a comment or description..."
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                    errors.description
                      ? "border-rose-500 focus:ring-rose-500/50"
                      : "border-slate-800 focus:border-violet-500 focus:ring-violet-500"
                  } rounded-xl focus:ring-1 text-white placeholder-slate-600 focus:outline-none transition-all resize-none`}
                />
              </div>
              {errors.description && (
                <span className="text-[11px] text-rose-500 block mt-1 font-medium">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
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
                className={`flex-1 py-3 text-white font-semibold rounded-xl shadow-lg transition-all cursor-pointer text-sm ${
                  currentType === "expense"
                    ? "bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-rose-600/10 hover:shadow-rose-600/20"
                    : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/10 hover:shadow-emerald-600/20"
                } hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50`}
              >
                {isSubmitting || isPending
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Add Transaction"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddEditTransactionModal;
