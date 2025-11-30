import api from '@/lib/api';

interface ResetPasswordParams {
    email?: string;
    password?: string;
    token?: string;
}

export const resetPasswordRequest = async (email: string): Promise<void> => {
  try {
      await api.post('/user/esqueci-minha-senha', null, {
        params: { email }
      });
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      throw new Error('Não foi possível enviar o email de redefinição de senha');
  }
};

export const resetPassword = async (params: ResetPasswordParams): Promise<void> => {
  try {
        console.log("params service", params);
        await api.post('/user/resetar-senha', params);
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw new Error('Não foi possível redefinir a senha');
  }
};