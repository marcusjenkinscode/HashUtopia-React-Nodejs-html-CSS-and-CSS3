import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false }) => (
  <div
    className={`
      rounded-xl border border-white/10 p-6
      ${glass ? 'bg-white/5 backdrop-blur-xl' : 'bg-[#111128]'}
      ${className}
    `}
  >
    {children}
  </div>
);
