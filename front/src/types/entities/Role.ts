/**
 * Interface que representa uma função/papel de usuário
 */
export interface Role {
  id: string;
  name: string;
  descricao?: string;
  permissoes?: string[];
}

/**
 * Enum com as funções disponíveis no sistema
 */
export enum RoleType {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_ADVOGADO = 'ROLE_ADVOGADO',
  ROLE_CLIENTE = 'ROLE_CLIENTE',
  ROLE_ESTAGIARIO = 'ROLE_ESTAGIARIO',
  ROLE_SECRETARIA = 'ROLE_SECRETARIA'
} 