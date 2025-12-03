import api from '@/lib/api';
import { ProfileFormData } from '@/schemas/profileSchema';
import { AdvogadoLista } from '@/types/entities/Advogado';

interface EnderecoDTO {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface UpdateClienteDTO {
  nome: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: EnderecoDTO;
}



export const getMeusAdvogados = async (): Promise<AdvogadoLista[]> => {
  try {
    const response = await api.get('/cliente/meus-advogados');
    const responseData = response.data as { data?: AdvogadoLista[] };

    return responseData.data || [];
  } catch (error) {
    console.error('Erro ao obter lista de advogados:', error);
    throw error;
  }
};

export const getPerfilAdvogado = async (advogadoId: string) => {
  try {
    const response = await api.get(`/cliente/advogado/${advogadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter perfil do advogado:', error);
    throw error;
  }
};


export const getNumeroDocumentosPendentes = async (): Promise<number> => {
  try {
    const response = await api.get('/cliente/documentos-pendentes');
    const responseData = response.data as { count: number };
    return responseData.count;
  } catch (error) {
    console.error('Erro ao obter número de documentos pendentes:', error);
    throw error;
  } 
};

export const updateClienteProfile = async (clienteData: UpdateClienteDTO) => {
  try {
    const response = await api.put('/cliente/informacoes-pessoais', clienteData);
    return response.data;
  }
  catch (error) {
    console.error('Erro ao atualizar perfil do cliente:', error);
    throw error;
  }
}