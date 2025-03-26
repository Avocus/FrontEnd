/**
 * Resposta de erro da API
 */
export interface ApiErrorResponse {
  error: string;
  status?: number;
  timestamp?: string;
}

/**
 * Formato genérico de resposta da API
 */
export interface ResponseContent<T> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
  params?: Record<string, unknown>;
} 