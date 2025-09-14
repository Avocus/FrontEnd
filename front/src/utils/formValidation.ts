export const getFieldValidationClass = (
  isTouched: boolean,
  hasError: boolean,
  isDirty: boolean
): string => {
  if (!isTouched) return "";

  if (hasError) return "border-red-500 focus:border-red-500";
  if (isDirty && !hasError) return "border-green-500 focus:border-green-500";

  return "";
};

/**
 * Extrai a mensagem de erro específica do backend para erros tratados
 * @param error - O erro capturado do catch
 * @param defaultMessage - Mensagem padrão caso não seja um erro tratado
 * @returns A mensagem de erro específica ou a mensagem padrão
 */
export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  const axiosError = error as {
    response?: {
      status?: number;
      data?: { message?: string }
    }
  };

  // Verifica se é um erro tratado do backend (status 400 com message)
  if (axiosError?.response?.status === 400 && axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }

  return defaultMessage;
};
