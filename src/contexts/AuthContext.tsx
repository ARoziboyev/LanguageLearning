import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import React from 'react';
export interface User {
  id: string;
  email: string;
  fullName: string;
  gender: 'male' | 'female';
  selectedLanguage?: string;
  isOnline: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, gender: 'male' | 'female') => Promise<void>;
  logout: () => void;
  updateLanguage: (language: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, fullName: string, gender: 'male' | 'female') => {
    // Mock registration - will be replaced with Supabase
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      gender,
      isOnline: true,
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('auth_password', password); // For demo only
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    // Mock login - will be replaced with Supabase
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === email) {
        setUser({ ...userData, isOnline: true });
        return;
      }
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    if (user) {
      setUser({ ...user, isOnline: false });
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateLanguage = (language: string) => {
    if (user) {
      const updatedUser = { ...user, selectedLanguage: language };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateLanguage, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
