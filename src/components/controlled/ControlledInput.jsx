import React from 'react';
import { useFormContext } from 'react-hook-form';

export function ControlledInput({ name, label, type = 'text', placeholder, icon: Icon, ...props }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];
  
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Icon size={18} />
          </div>
        )}
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-slate-950 border ${
            error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500'
          } rounded-xl focus:ring-1 text-white placeholder-slate-600 focus:outline-none transition-all`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] text-rose-500 block mt-1 font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
}
