'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card } from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth';

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(form);
    } catch (error) {
      alert('Signup failed');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6">
        <h1 className="mb-4 text-lg font-bold">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="mb-4"
            size="lg"
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="mb-4"
            size="lg"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="mb-6"
            size="lg"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  );
}