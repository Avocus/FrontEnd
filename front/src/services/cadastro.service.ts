interface UserParams {
    name: string;
    isClient: boolean
    username: string;
    password: string;
}

export const cadastrarUsuario = async (params: UserParams) => {
    const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    
    if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
    }
    
    return response.json();
    };