import axios from 'axios';
import { useAuthStore } from '@/store';

// Variável para controlar se já estamos no processo de logout
let isHandlingAuthError = false;

// Habilitar para debugging
const DEBUG = true;

// Utilitário de log apenas quando o debug está habilitado
const log = (...args: any[]) => {
  if (DEBUG) {
    console.log('[ApiClient]', ...args);
  }
};

// Criando uma instância do Axios para configuração centralizada
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token JWT em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    // Obtém o token do sessionStorage
    const token = sessionStorage.getItem('token');
    
    // Se o token existe, adiciona ao header Authorization
    if (token) {
      // Garante que o objeto headers existe
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      log(`Requisição para ${config.url} com token`);
    } else {
      log(`Requisição para ${config.url} sem token`);
    }
    
    return config;
  },
  (error) => {
    log('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
apiClient.interceptors.response.use(
  (response) => {
    log(`Resposta de ${response.config.url} com status ${response.status}`);
    return response;
  },
  (error) => {
    // Verifica se o erro é de autenticação (401) e se não estamos já tratando um erro de autenticação
    if (error.response && error.response.status === 401 && !isHandlingAuthError) {
      // Evita loops ao tratar erros de autenticação
      isHandlingAuthError = true;
      
      log(`Erro 401 em ${error.config?.url}, iniciando processo de logout`);
      
      // Limpa os dados de autenticação
      const authStore = useAuthStore.getState();
      
      // Verifique se já estamos na página de login para evitar loops
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        
        // Se não estiver na página de login, faça o redirecionamento
        if (currentPath !== '/login') {
          log(`Redirecionando de ${currentPath} para /login devido a erro 401`);
          
          // Limpar dados de autenticação
          authStore.logout();
          sessionStorage.removeItem('token');
          
          // Antes de redirecionar, armazena a URL atual para retornar após o login
          sessionStorage.setItem('redirectAfterLogin', currentPath);
          
          // Usamos setTimeout para garantir que o redirecionamento não causará loops
          setTimeout(() => {
            window.location.href = '/login?expired=true';
            isHandlingAuthError = false;
          }, 100);
        } else {
          // Reset flag quando terminamos
          log('Já estamos na página de login, ignorando redirecionamento');
          isHandlingAuthError = false;
        }
      }
    } else if (error.response) {
      log(`Erro ${error.response.status} em ${error.config?.url}`);
    } else {
      log('Erro na requisição sem resposta', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 