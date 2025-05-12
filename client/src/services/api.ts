import axios from 'axios';

const API_URL = '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized globally (redirect to login or refresh token)
    if (error.response && error.response.status === 401) {
      // Clear token if it has expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Generic API service
export const apiService = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.get<T>(endpoint);
    return response.data;
  },
  
  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  },
  
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await apiClient.put<T>(endpoint, data);
    return response.data;
  },
  
  patch: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await apiClient.patch<T>(endpoint, data);
    return response.data;
  },
  
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete<T>(endpoint);
    return response.data;
  },
};

export default apiService;