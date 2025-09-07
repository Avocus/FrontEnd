// services/login.service.ts
export const loginWithEmail = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, method: 'email' }),
  });

  if (!response.ok) {
    throw new Error('Erro ao logar com email/senha');
  }

  return response.json();
};

export const loginWithEmailServer = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, method: 'server' }),
  });

  if (!response.ok) {
    throw new Error('Erro ao logar com email/senha');
  }

  return response.json();
};
