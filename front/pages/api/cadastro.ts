import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, isClient, username, password } = req.body;

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, isClient, username, password }),
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar usuário');
            }

            const user = await response.json();
            res.status(200).json({ user });
        } catch (error: unknown) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}