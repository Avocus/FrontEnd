import { Especialidade } from '../enums';
import { Documento } from './Documento';
import { Processo } from './Processo';

/**
 * Interface base para perfil
 */
export interface BaseProfile {
  id: string;
  userId: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  foto?: string;
  documentos?: Documento[];
  fotoPerfil?: string;
  processosFinalizados?: Processo[];
  processosAtivos?: Processo[];
  processos?: Processo[];
}

/**
 * Interface para perfil de advogado
 */
export interface AdvogadoProfile extends BaseProfile {
  oab: string;
  bio?: string;
  formacao?: string;
  faculdade?: string;
  areasAtuacao?: string[];
  avaliacao?: number;
  especialidades?: Especialidade[];
  custoHora?: number;
}

/**
 * Interface para perfil de cliente
 */
export interface ClienteProfile extends BaseProfile {
  profissao?: string;
  empresa?: string;
  observacoes?: string;
}

/**
 * Tipo que representa qualquer tipo de perfil
 */
export type Profile = AdvogadoProfile | ClienteProfile;

/**
 * Estado do perfil no gerenciador de estado
 */
export interface ProfileState {
  profile: Profile | null;
  isAdvogado: boolean;
  isCliente: boolean;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  pendente: boolean;
  
  loadProfile: () => Promise<void>;
  checkProfileCompletion: () => Promise<boolean>;
  updateProfile: (updatedProfile: Profile) => Promise<Profile>;
  clearProfile: () => void;
} 