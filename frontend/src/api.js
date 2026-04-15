import axios from 'axios';
import { useAuthStore } from './store/authStore';

const getEnv = () => {
  try {
    return new Function('return import.meta.env')();
  } catch {
    return typeof globalThis.process !== 'undefined' ? globalThis.process.env : {};
  }
};

const baseURL = getEnv()?.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function attachFieldErrors(err, body) {
  if (
    body?.data &&
    typeof body.data === 'object' &&
    !Array.isArray(body.data) &&
    body.status === 'ERROR'
  ) {
    err.fieldErrors = body.data;
  }
}

api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && body.status === 'ERROR') {
      const err = new Error(body.message || 'Request failed');
      attachFieldErrors(err, body);
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    const body = error.response?.data;
    const msg = body?.message || error.message || 'Something went wrong. Please try again.';
    const err = new Error(msg);
    attachFieldErrors(err, body || {});
    return Promise.reject(err);
  }
);

/**
 * @template T
 * @param {import('axios').AxiosResponse<{ data: T; message: string; status: string }>} res
 */
export function unwrap(res) {
  return res.data.data;
}

export default api;
