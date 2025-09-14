import api from '@/lib/api';

interface UserParams {
    name: string;
    client: boolean
    username: string;
    password: string;
    inviteToken?: string;
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