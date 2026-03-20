import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const originalRequestPath = error.config?.url || '';
    const isLoginPath = originalRequestPath.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginPath) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
