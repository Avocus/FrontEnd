"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { ListaAdvogados } from "@/components/advogados/ListaAdvogados";

export default function AdvogadosPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.client) {
      router.push('/clientes');
    }
  }, [user, router]);

  if (user && !user.client) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Advogados</h1>
      </div>

      <ListaAdvogados />
    </div>
  );
}