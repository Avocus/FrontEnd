"use client"

import * as React from "react"
import { CadastroForm } from "@/components/cadastro/CadastroForm"
import { useEffect, useState } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useSearchParams } from "next/navigation"

export default function Cadastro() {
  const { updateConfig } = useLayout()
  const searchParams = useSearchParams()
  const [inviteData, setInviteData] = useState<any>(null)

  useEffect(() => {
    updateConfig({
      showNavbar: false,
      showSidebar: false,
      showFooter: false
    });
  }, [updateConfig]);

  useEffect(() => {
    const invite = searchParams?.get('invite')
    if (invite) {
      try {
        const decoded = JSON.parse(atob(invite))
        setInviteData(decoded)
      } catch (error) {
        console.error('Erro ao decodificar convite:', error)
      }
    }
  }, [searchParams]);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-cadastro.jpg)', filter: 'brightness(0.4)' }}></div>
        <div className="relative flex w-full max-w-2xl flex-col gap-6">
          <CadastroForm inviteData={inviteData} />
        </div>
      </div>
   )
}
