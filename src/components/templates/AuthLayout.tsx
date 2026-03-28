import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] relative overflow-hidden">
    {/* Background gradient effects */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
    <div className="relative w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          HashUtopia
        </h1>
        <p className="text-sm text-slate-500 mt-1">v3.0 — Production-Ready React Rebuild</p>
      </div>
      {children}
    </div>
  </div>
);
