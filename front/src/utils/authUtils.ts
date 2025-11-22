/**
 * Obtém o token de autenticação armazenado nos cookies
 * @returns Token de autenticação ou null se não existir
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return decodeURIComponent(value);
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao acessar cookies:", error);
    return null;
  }
};

/**
 * Define o token de autenticação nos cookies
 * @param token Token de autenticação
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? '; Secure' : '';
    document.cookie = `token=${encodeURIComponent(token)}${secureFlag}; SameSite=Strict; Path=/; Max-Age=86400`;
  } catch (error) {
    console.error("Erro ao definir token nos cookies:", error);
  }
};

/**
 * Remove o token de autenticação dos cookies
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? '; Secure' : '';
    document.cookie = `token=${secureFlag}; SameSite=Strict; Path=/; Max-Age=0`;
  } catch (error) {
    console.error("Erro ao remover token dos cookies:", error);
  }
};

/**
 * Verifica se o usuário está autenticado (tem token)
 * @returns True se o usuário estiver autenticado, false caso contrário
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
