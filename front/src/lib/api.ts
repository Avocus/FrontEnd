import axios from 'axios';
import { getToken, removeToken } from '../utils/authUtils';

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

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Unauthorized), deslogar o usuário
    if (error.response && error.response.status === 401) {
      // Evitar loop infinito de redirecionamento se já estiver na página de login
      const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login');
      
      if (!isLoginPage) {
        // Limpar o token usando a função removeToken
        if (typeof window !== 'undefined') {
          removeToken();
          
          // Redirecionar para a página de login
          window.location.href = '/login?expired=true';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 