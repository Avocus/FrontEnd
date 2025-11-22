import api from '@/lib/api';

interface AddressParams {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
    cep?: string;
    complemento?: string;
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
    phone?: string;
    address?: AddressParams;
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