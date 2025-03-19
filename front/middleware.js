import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const token = req.cookies.get('token')?.value; // Supondo que o JWT está em um cookie chamado "token"

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    // Verifica o JWT
    const decoded = jwt.verify(token, 'sua_chave_secreta'); // Substitua pela sua chave secreta
    const { role } = decoded; // Supondo que o JWT contém o campo "role"

    // Verifica se o usuário está tentando acessar uma rota que não corresponde ao seu perfil
    if (req.nextUrl.pathname.startsWith('/advogado') && role !== 'advogado') {
      return NextResponse.redirect(new URL('/acesso-negado', req.url)); // Redireciona se não for advogado
    }

    if (req.nextUrl.pathname.startsWith('/cliente') && role !== 'cliente') {
      return NextResponse.redirect(new URL('/acesso-negado', req.url)); // Redireciona se não for cliente
    }

    // Permite o acesso se tudo estiver correto
    return NextResponse.next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Se o token for inválido, redireciona para a página de login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

// Define as rotas que devem ser protegidas pelo middleware
export const config = {
  matcher: ['/advogado/:path*', '/cliente/:path*'], // Aplica o middleware apenas nas rotas de advogado e cliente
};