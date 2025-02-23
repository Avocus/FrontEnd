// pages/api/logar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../firebaseAdminConfig'; // Importe o Firebase Admin
import { auth, db, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { method, email, password, idToken, accessToken } = req.body;

    try {
      let userCredential;
      if (method === 'server') {
        await fetch('https://avocuss.duckdns.org/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              throw new Error(data.error);
            }
            userCredential = data;
          })
          .catch(error => {
            throw new Error(error);
          });
      }
      else if (method === 'email') {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else if (method === 'google') {
        console.log('Verificando token Google:', idToken);

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log('Token decodificado:', decodedToken);

        const credential = GoogleAuthProvider.credential(accessToken);
        userCredential = await signInWithCredential(auth, credential);
      } else {
        throw new Error('Método de login inválido');
      }

      if (method !== 'server'){
        const user = userCredential!.user;

        const userDoc = await getDoc(doc(db, "USER", user.uid));
        if (userDoc.exists()) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            data: userDoc.data(),
          };
          res.status(200).json({ user: userData });
        } else {
          throw new Error("Nenhum dado encontrado para este usuário.");
        }
      } else {
        res.status(200).json({ userCredential });
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro no backend:', error);
        res.status(400).json({ error: error.message });
      } else {
        console.error('Erro desconhecido no backend:', error);
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}