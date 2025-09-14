import { NextApiRequest, NextApiResponse } from "next";
import { AUTH_ROUTES, UserApiResponse, ApiErrorResponse, UserResponse } from "../../lib/api-routes";

// Interfaces para tipagem
interface RegisterCredentials {
    name: string;
    client: boolean;
    username: string;
    password: string;
    inviteToken: string;
}

// Função para registro pelo servidor
async function serverRegister(name: string, client: boolean, username: string, password: string, inviteToken: string): Promise<UserResponse> {
    try {
        const credentials: RegisterCredentials = { name, client, username, password, inviteToken };

        const response = await fetch(AUTH_ROUTES.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const responseData = await response.json() as UserApiResponse | ApiErrorResponse;

        if (!response.ok || 'error' in responseData) {
            throw new Error('error' in responseData ? responseData.error : 'Erro ao cadastrar usuário');
        }
        
        return 'data' in responseData ? responseData.data : responseData as unknown as UserResponse;
    } catch (error) {
        throw error;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { name, client, username, password, inviteToken } = req.body;

    try {
        const result = await serverRegister(name, client, username, password, inviteToken);
        res.status(200).json({ user: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(400).json({ error: error.message });
        } else {
            console.error('Erro desconhecido ao cadastrar usuário:', error);
            res.status(400).json({ error: 'Ocorreu um erro desconhecido' });
        }
    }
}