import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent',
  secondary: 'bg-purple-600 hover:bg-purple-700 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-white/10 text-slate-300 border-slate-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 rounded-lg border font-medium
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
  >
    {loading && (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    {children}
  </button>
);
