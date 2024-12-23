'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: { name: string; email: string; password: string }) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signup = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, setUser, setLoading, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
