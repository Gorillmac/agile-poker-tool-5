import { apiService } from './api';
import { User } from '../types/api';

// API endpoints
const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  CURRENT_USER: '/users/me'
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  password: string;
}

export const userService = {
  login: (credentials: LoginRequest) => 
    apiService.post<{user: User, token: string}>(ENDPOINTS.LOGIN, credentials),
    
  register: (userData: RegisterRequest) => 
    apiService.post<{user: User, token: string}>(ENDPOINTS.REGISTER, userData),
    
  logout: () => 
    apiService.post(ENDPOINTS.LOGOUT),
    
  getCurrentUser: () => 
    apiService.get<User>(ENDPOINTS.CURRENT_USER),
};

export default userService;