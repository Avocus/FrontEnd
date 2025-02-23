import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { useRouter } from "next/navigation";
import { PrivacyPolicy } from "../login/privacyPolicy";
import { ServiceTerms } from "../login/serviceTerms";
import { ModeToggle } from "../ui/modeToggle";

export function Configs() {
  const router = useRouter();

  const handleEditProfileClick = () => {
    router.push("/editar");
  };

  const handleLogout = () => {
    // Lógica para sair do app
    console.log("Usuário saiu do app");
  };

  const handleResetPassword = () => {
    // Lógica para redefinir senha
    console.log("Redefinir senha");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-16 mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Editar Perfil */}
          <div className="space-y-2">
            <Label className="text-lg">Editar Perfil</Label>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleEditProfileClick}
            >
              Editar Perfil
            </Button>
          </div>

          {/* Mudar Tema */}
          <div className="space-y-2 flex justify-start items-center">
            <Label className="text-lg mr-10">Tema</Label>
            <ModeToggle />
            {/* <div className="flex items-center space-x-2">
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <span>{theme === "dark" ? "Tema Escuro" : "Tema Claro"}</span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setTheme("system")}
            >
              Usar Tema do Sistema
            </Button> */}
          </div>

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

          {/* Sair do App */}
          <div className="space-y-2">
            <Label className="text-lg">Conta</Label>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Sair do App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}