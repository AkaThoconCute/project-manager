export const BACKEND_MODE = Number(import.meta.env.VITE_BACKEND_MODE ?? '0') as 0 | 1;
export const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:5000';
export const isFakeMode = (): boolean => BACKEND_MODE === 0;
