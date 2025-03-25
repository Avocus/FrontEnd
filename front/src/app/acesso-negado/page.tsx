"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AcessoNegado() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-destructive mb-4">Acesso Negado</h1>
        <div className="mb-8 text-muted-foreground">
          <p className="mb-4">
            Você não tem permissão para acessar esta página ou recurso.
          </p>
          <p>
            Verifique suas credenciais ou entre em contato com o suporte se acredita que isto é um erro.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" onClick={() => router.push('/home')}>
            Voltar para Home
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
} 