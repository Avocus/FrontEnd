"use client"

import * as React from "react"
import { CadastroForm } from "@/components/cadastro/cadastro-form"

const Cadastro: React.FC = () => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-cadastro.jpg)', filter: 'brightness(0.4)' }}></div>
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <CadastroForm />
      </div>
    </div >
  )
}

export default Cadastro
