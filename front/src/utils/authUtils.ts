/**
 * Obtém o token de autenticação armazenado no sessionStorage
 * @returns Token de autenticação ou null se não existir
 */
export const getToken = (): string | null => {
  // Verificação de servidor usando typeof window e process.browser
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") {
    return null;
  }
  
  try {
    return sessionStorage.getItem("token");
  } catch (error) {
    console.error("Erro ao acessar sessionStorage:", error);
    return null;
  }
};

/**
 * Define o token de autenticação no sessionStorage
 * @param token Token de autenticação
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") {
    return;
  }
  
  try {
    sessionStorage.setItem("token", token);
  } catch (error) {
    console.error("Erro ao definir token no sessionStorage:", error);
  }
};

/**
 * Remove o token de autenticação do sessionStorage
 */
export const removeToken = (): void => {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") {
    return;
  }
  
  try {
    sessionStorage.removeItem("token");
  } catch (error) {
    console.error("Erro ao remover token do sessionStorage:", error);
  }
};

/**
 * Verifica se o usuário está autenticado (tem token)
 * @returns True se o usuário estiver autenticado, false caso contrário
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
