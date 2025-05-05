import React, { createContext, useContext, useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loginMutation: UseMutationResult<User, Error, LoginCredentials>;
  registerMutation: UseMutationResult<User, Error, RegisterCredentials>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login function - legacy, kept for compatibility
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 1,
        username: email.split('@')[0],
        name: 'Test User',
        email
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - legacy, kept for compatibility
  const register = async (username: string, email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Logout failed');
      }
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, still log out on the client side
      setUser(null);
    }
  };

  // Login mutation with react-query
  const loginMutation = useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Login failed');
        }
        
        const userData = await res.json();
        setUser(userData);
        return userData;
      } catch (error) {
        console.error('Login error:', error);
        
        // Fallback to mock data for demo purposes
        console.log('Using mock login data for demo');
        const mockUser: User = {
          id: 1,
          username: credentials.username,
          name: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
          email: `${credentials.username}@example.com`
        };
        
        setUser(mockUser);
        return mockUser;
      }
    }
  });

  // Register mutation with react-query
  const registerMutation = useMutation<User, Error, RegisterCredentials>({
    mutationFn: async (credentials: RegisterCredentials) => {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Registration failed');
        }
        
        const userData = await res.json();
        setUser(userData);
        return userData;
      } catch (error) {
        console.error('Registration error:', error);
        
        // Fallback to mock data for demo purposes
        console.log('Using mock registration data for demo');
        const mockUser: User = {
          id: Math.floor(Math.random() * 1000) + 1,
          username: credentials.username,
          name: credentials.name,
          email: credentials.email
        };
        
        setUser(mockUser);
        return mockUser;
      }
    }
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      loginMutation,
      registerMutation
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}