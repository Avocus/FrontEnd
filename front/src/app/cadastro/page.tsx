"use client"

import * as React from "react"
import { CadastroForm } from "@/components/cadastro/CadastroForm"
import { useEffect, useState, Suspense } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { validarTokenConvite } from '@/services/advogado/advogadoService';
import { useToast } from '@/hooks/useToast';

type InviteData = { isInvite: boolean; token: string } | null;

function CadastroContent() {
  const { updateConfig } = useLayout()
  const searchParams = useSearchParams()
  const [inviteData, setInviteData] = useState<InviteData>(null)
  const [inviteValidated, setInviteValidated] = useState(false)
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { error: showError } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
      return;
    }
    updateConfig({
      showNavbar: false,
      showSidebar: false,
      showFooter: false
    });
  }, [updateConfig, isAuthenticated, router]);

  useEffect(() => {
    const invite = searchParams?.get('invite')
    if (invite && !inviteValidated) {
      setInviteValidated(true);
      validarTokenConvite(invite)
        .then((validationResult) => {
          if (validationResult.valido) {
            setInviteData({
              isInvite: true,
              token: invite
            });
          } else {
            showError(validationResult.erro || 'Link de convite inválido');
            setInviteData(null);
          }
        })
        .catch((error) => {
          console.error('Erro ao validar convite:', error)
          showError('Erro ao validar link de convite');
          setInviteData(null);
        });
    }
  }, [searchParams, inviteValidated, showError]);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-cadastro.jpg)', filter: 'brightness(0.4)' }}></div>
        <div className="relative flex w-full max-w-2xl flex-col gap-6">
          <CadastroForm inviteData={inviteData} />
        </div>
      </div>
   )
}

export default function Cadastro() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-cadastro.jpg)', filter: 'brightness(0.4)' }}></div>
        <div className="relative flex w-full max-w-2xl flex-col gap-6">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    }>
      <CadastroContent />
    </Suspense>
  )
}
