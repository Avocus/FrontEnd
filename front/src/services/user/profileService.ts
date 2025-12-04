import api from '@/lib/api';
import { Especialidade } from '@/types';
import { PerfilCliente } from '@/types/entities/Cliente';
import { AdvogadoProfile } from '@/types/entities/Profile';
import { ProfileFormData } from '@/schemas/profileSchema';

export interface UserDadosDTO {
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  tipoUsuario?: string;
  advogado?: {
    id: number;
    nome: string;
    cpf: string;
    oab: string;
    bio?: string;
    email: string;
    especialidades?: Especialidade[];
    dataNascimento?: string;
    telefone?: string;
  };
  cliente?: any;
}

export const checkProfileStatus = async (): Promise<boolean> => {
  try {
    const response = await api.get('/user/perfil-pendente');
    return response.data as boolean;
  } catch (error) {
    console.error('Erro ao verificar status do perfil:', error);
    throw error;
  }
};

export const getProfileData = async (): Promise<UserDadosDTO> => {
  try {
    const response = await api.get('/user/dados-gerais');
    const responseData = response.data as { data: UserDadosDTO };
    return responseData.data;
  } catch (error) {
    console.error('Erro ao obter dados do perfil:', error);
    throw new Error('Não foi possível carregar os dados do perfil');
  }
};

export const updateProfileData = async (data: ProfileFormData): Promise<PerfilCliente> => {
  try {
    let response;
    if(data.isAdvogado){
      response = await api.put('/advogado/dados-gerais', data);
    }else{
      response = await api.put('/cliente/dados-gerais', data);
    }
    const responseData = response.data as { data: PerfilCliente };
    return responseData.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do perfil:', error);
    throw new Error('Não foi possível atualizar os dados do perfil');
  }
};

export const updateAdvogado = async (data: ProfileFormData): Promise<AdvogadoProfile> => {
  try {
    const response = await api.put('/advogado/dados-gerais', data);
    const responseData = response.data as { data: AdvogadoProfile };
    return responseData.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do advogado:', error);
    throw new Error('Não foi possível atualizar os dados do advogado');
  }
};

export const updateCliente = async (data: ProfileFormData): Promise<PerfilCliente> => {
  try {
    const response = await api.put('/cliente/dados-gerais', data);
    const responseData = response.data as { data: PerfilCliente };
    return responseData.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do cliente:', error);
    throw new Error('Não foi possível atualizar os dados do cliente');
  }
};