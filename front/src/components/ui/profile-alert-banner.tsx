"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { memo } from "react";

// Usar memo para evitar re-renderizações desnecessárias
export const ProfileAlertBanner = memo(function ProfileAlertBanner() {
  const { pendente } = useProfileStore();
  const { user } = useAuthStore();
  const router = useRouter();

  if (!pendente || !user) {
    return null;
  }

  const handleProfileRedirect = () => {
    router.push('/conta');
  };

  // Adicionando key fixa para manter a identidade do componente entre navegações
  return (
    <div className="px-4">
      <Alert key="profile-alert" variant="destructive" className="mb-4 mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Complete seu perfil</AlertTitle>
        <AlertDescription className="flex flex-col md:flex-row md:items-center gap-2">
          <span>Seu perfil está incompleto. Complete suas informações para uma melhor experiência.</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="md:ml-auto"
            onClick={handleProfileRedirect}
            >
            Completar perfil
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}); 