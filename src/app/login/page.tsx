'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input, Button } from '@nextui-org/react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    alert(1)
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          fullWidth
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          fullWidth
          required
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4"
        />
        <Button type="submit" className="w-full mt-6">
          Login
        </Button>
      </form>
    </div>
  );
}