import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { useRouter } from "next/navigation";
import { PrivacyPolicy } from "@/components/login/PrivacyPolicy";
import { ServiceTerms } from "@/components/login/ServiceTerms";
import { useAuthStore } from "@/store";

export function Configs() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    // Limpar token e estado de autenticação
    sessionStorage.removeItem('token');
    logout();
    router.push('/login');
  };

  const handleResetPassword = () => {
    // Lógica para redefinir senha
    router.push('/recuperar-senha');
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Redefinir Senha */}
          <div className="space-y-2">
            <Label className="text-lg">Redefinir Senha</Label>
            <Button variant="outline" className="w-full" onClick={handleResetPassword}>
              Redefinir Senha
            </Button>
          </div>

          {/* Política de Privacidade e Termos de Serviço */}
          <div className="space-y-2">
            <div className="flex flex-col space-y-2">
              <div className="w-full">
                <PrivacyPolicy />
              </div>
              <div className="w-full">
                <ServiceTerms />
              </div>
            </div>
          </div>

          {/* Sair */}
          <div className="space-y-2">
            <Label className="text-lg">Conta</Label>
            <Button variant="secondary" className="w-full text-primary hover:bg-destructive" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}