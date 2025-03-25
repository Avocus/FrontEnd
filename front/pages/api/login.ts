// pages/api/logar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../firebaseAdminConfig'; // Importe o Firebase Admin
import { auth, db, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { AUTH_ROUTES, UserApiResponse, ApiErrorResponse, UserResponse } from '../../lib/api-routes';

// Interfaces para tipagem
interface LoginCredentials {
  username: string;
  password: string;
}

interface FirebaseUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  data: Record<string, any>;
}

// Função para autenticação pelo servidor
async function serverLogin(email: string, password: string): Promise<UserResponse> {
  try {
    const credentials: LoginCredentials = { username: email, password };
    
    const response = await fetch(AUTH_ROUTES.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const responseData = await response.json() as UserApiResponse | ApiErrorResponse;

    if ('error' in responseData) {
      throw new Error(responseData.error);
    }
    
    return responseData.data;
  } catch (error) {
    throw error;
  }
}

// Função para autenticação por email/senha no Firebase
async function emailLogin(email: string, password: string): Promise<FirebaseUserData> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await getUserData(userCredential.user);
}

// Função para autenticação pelo Google
async function googleLogin(idToken: string, accessToken: string): Promise<FirebaseUserData> {
  
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  
  const credential = GoogleAuthProvider.credential(accessToken);
  const userCredential = await signInWithCredential(auth, credential);
  
  return await getUserData(userCredential.user);
}

// Função para obter dados do usuário do Firestore
async function getUserData(user: any): Promise<FirebaseUserData> {
  const userDoc = await getDoc(doc(db, "USER", user.uid));
  
  if (userDoc.exists()) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      data: userDoc.data(),
    };
  } else {
    throw new Error("Nenhum dado encontrado para este usuário.");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { method, email, password, idToken, accessToken } = req.body;

  try {
    let result;

    switch (method) {
      case 'server':
        result = await serverLogin(email, password);
        break;
      case 'email':
        result = { user: await emailLogin(email, password) };
        break;
      case 'google':
        result = { user: await googleLogin(idToken, accessToken) };
        break;
      default:
        throw new Error('Método de login inválido');
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro no backend:', error);
      res.status(400).json({ error: error.message });
    } else {
      console.error('Erro desconhecido no backend:', error);
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
}