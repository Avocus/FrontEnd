import api from '@/lib/api';
import { Endereco } from '@/types/entities/Endereco';

interface DadosContatoParams {
    site?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    telefone?: string;
}

interface UserParams {
    name: string;
    client: boolean;
    username: string;
    password: string;
    inviteToken?: string;
    cpf?: string;
    oab?: string;
    dateOfBirth?: string;
    telefone?: string;
    address?: Endereco;
    bio?: string;
    especialidades?: string[];
    dadosContato?: DadosContatoParams;
}

export const cadastrarUsuario = async (params: UserParams) => {
    try {
        const response = await api.post('/user/registrar', params);
        return response.data;
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        throw error;
    }
};