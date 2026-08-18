import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";

export function ControlledPasswordInput({ name, label, placeholder = "••••••••", ...props }) {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];
  
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <IconLock size={18} />
        </div>
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border ${
            error
              ? "border-rose-500 focus:ring-rose-500/50"
              : "border-slate-200 dark:border-slate-800 focus:border-violet-500 focus:ring-violet-500/30"
          } rounded-xl focus:ring-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all shadow-xs`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
      {error && (
        <span className="text-[11px] text-rose-500 block mt-1 font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
}

export default ControlledPasswordInput;
