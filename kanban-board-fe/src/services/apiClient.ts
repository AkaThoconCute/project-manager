import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config/env';

interface StoredUserInfo {
  token: string;
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return null;
    const parsed: StoredUserInfo = JSON.parse(raw);
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getAuthConfig(): { headers: { 'Content-Type': string; Authorization: string } } {
  const token = getToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    },
  };
}

export function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError.response && axiosError.response.data.message) {
    return axiosError.response.data.message;
  }
  if (axiosError.message) {
    return axiosError.message;
  }
  return 'An unexpected error occurred';
}
