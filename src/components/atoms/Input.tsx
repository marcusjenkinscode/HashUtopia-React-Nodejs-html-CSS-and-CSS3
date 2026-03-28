import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input
        {...rest}
        className={`
          w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200
          placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1
          focus:ring-indigo-500/30 transition-colors
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
