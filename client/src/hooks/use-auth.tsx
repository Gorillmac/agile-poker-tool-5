import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
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
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginMutation: UseMutationResult<User, Error, LoginCredentials>;
  registerMutation: UseMutationResult<User, Error, RegisterCredentials>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/user', { 
      credentials: 'include' 
    })
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(userData => {
        if (userData) setUser(userData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Login function - updated for API integration
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const userData = await res.json();
      setUser(userData);
      return;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - updated for API integration
  const register = async (username: string, email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, name }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Registration failed');
      }
      
      const userData = await res.json();
      setUser(userData);
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
        console.error('Logout API call failed, but continuing with client logout');
      }
      
      // Always clear user from state regardless of API success
      setUser(null);
      // Clear any cached user data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, still log out on the client side
      setUser(null);
    }
  };

  // Login mutation with react-query
  const loginMutation = useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
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
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      return userData;
    }
  });

  // Register mutation with react-query
  const registerMutation = useMutation<User, Error, RegisterCredentials>({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Registration failed');
      }
      
      const userData = await res.json();
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      return userData;
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