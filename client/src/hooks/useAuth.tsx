import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, LoginRequest, RegisterRequest } from '../services';
import { User } from '../types/api';
import { useToast } from '@/hooks/use-toast';

// Hook for managing user authentication
export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to get the current authenticated user
  const { 
    data: user, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/users/me'],
    queryFn: () => userService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't show unhandled API errors for this query
    useErrorBoundary: false,
  });

  // Mutation for user login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => userService.login(credentials),
    onSuccess: (data) => {
      // Store the JWT token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Update the user in the cache
      queryClient.setQueryData(['/api/users/me'], data.user);
      
      toast({
        title: 'Welcome back!',
        description: `You are now logged in as ${data.user.name}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for user registration
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => userService.register(userData),
    onSuccess: (data) => {
      // Store the JWT token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Update the user in the cache
      queryClient.setQueryData(['/api/users/me'], data.user);
      
      toast({
        title: 'Registration successful!',
        description: `Welcome to Agile Poker, ${data.user.name}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for user logout
  const logoutMutation = useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: () => {
      // Remove the token from localStorage
      localStorage.removeItem('token');
      
      // Clear the user from the cache
      queryClient.setQueryData(['/api/users/me'], null);
      
      // Invalidate all queries to force refetch after login
      queryClient.invalidateQueries();
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Convenience login function
  const login = (username: string, password: string) => {
    return loginMutation.mutateAsync({ username, password });
  };

  // Convenience register function
  const register = (username: string, email: string, name: string, password: string) => {
    return registerMutation.mutateAsync({ username, email, name, password });
  };

  // Convenience logout function
  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    loginMutation,
    registerMutation,
    logoutMutation,
    refetch,
  };
}