import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/templates/AuthLayout';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('demo@hashutopia.io');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(
      { id: '1', email, username: 'demo', role: 'admin', balance: 1500 },
      'demo-jwt-token'
    );
    setLoading(false);
    void navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <Card glass>
        <form onSubmit={(e) => { void handleLogin(e); }} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-200">Sign In</h2>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@hashutopia.io"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" loading={loading} className="w-full mt-2">
            Sign In
          </Button>
          <p className="text-xs text-center text-slate-600">
            Demo credentials: demo@hashutopia.io / demo
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
};
