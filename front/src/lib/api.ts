import axios from 'axios';
import { getToken, removeToken } from '@/utils/authUtils';

// Criar uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url ?? '';
      const isAuthEndpoint = requestUrl.includes('/user/login') || requestUrl.includes('/auth/refresh');
      const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login');

      // Não forçar redirect para endpoints de autenticação (ex: login) ou se já estivermos na página de login
      if (!isAuthEndpoint && !isLoginPage) {
        if (typeof window !== 'undefined') {
          removeToken();
          window.location.href = '/login?expired=true';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 