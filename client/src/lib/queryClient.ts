import { QueryClient } from '@tanstack/react-query';

export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    try {
      const data = await res.json();
      errorMessage = data.message || `Error ${res.status}: ${res.statusText}`;
    } catch (e) {
      errorMessage = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return res;
}

export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string,
  body?: object
) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(`/api${path}`, options);
  return throwIfResNotOk(res);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: (string | number)[] }) => Promise<T | undefined> =
  (options) => async (context) => {
    const path = context.queryKey.join('/').replace(/\/\//g, '/');
    try {
      const res = await apiRequest('GET', path);
      if (res.status === 204) {
        return undefined;
      }
      return await res.json();
    } catch (e) {
      if (e instanceof Error && e.message.includes('401') && options.on401 === 'returnNull') {
        return undefined;
      }
      throw e;
    }
  };

// Configure the global query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});