'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'CLAIMS_AGENT' | 'MANAGER' | 'FINANCIAL_OFFICER';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'CLAIMS_AGENT',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = (email: string, password: string) => {
    // For demo purposes, just set the mock user
    setUser(mockUser);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 