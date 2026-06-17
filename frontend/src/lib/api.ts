import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000, 
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('engnet_token')
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);


api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
  
      localStorage.removeItem('engnet_token');
      localStorage.removeItem('engnet_user');
      window.location.href = '/login_cadastro';
    }

    return Promise.reject(error);
  },
);



export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    return data?.message ?? error.message ?? 'Erro desconhecido.';
  }
  if (error instanceof Error) return error.message;
  return 'Erro desconhecido.';
}

export default api;
