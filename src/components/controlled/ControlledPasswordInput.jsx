import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';

export function ControlledPasswordInput({ name, label, placeholder = '••••••••', ...props }) {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];
  
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <IconLock size={18} />
        </div>
        <input
          {...register(name)}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 bg-slate-950 border ${
            error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500'
          } rounded-xl focus:ring-1 text-white placeholder-slate-600 focus:outline-none transition-all`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
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
