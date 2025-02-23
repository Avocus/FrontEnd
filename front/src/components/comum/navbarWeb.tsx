import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useState } from "react";
import { ChatAvocuss } from "./chatAvocuss"; // Importação do ChatAvocuss
import { Notificacoes } from "./notificacoes";

export function NavbarWeb() {
  const [chatOpen, setChatOpen] = useState(false);
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);


  return (
    <nav className="flex items-center justify-between p-4 border-b">
      {/* Nome no canto esquerdo */}
      <div className="text-xl font-bold flex-1 text-start cursor-pointer" onClick={() => window.location.href = "/home"}>Avocuss</div>

      {/* Abas de navegação no centro */}
      <NavigationMenu className="flex-1 text-center">
        <NavigationMenuList className="inline-flex">
          <NavigationMenuItem>
            <NavigationMenuLink href="/agenda" className="px-4 py-2">
              Agenda
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2">
              Serviços
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem onClick={() => setChatOpen(true)}>
            <NavigationMenuLink className="px-4 py-2">
              Chat
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/biblioteca" className="px-4 py-2">
              Biblioteca
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/videoteca" className="px-4 py-2">
              Videoteca
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/casos" className="px-4 py-2">
              Casos
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />

      {/* Seção do perfil no canto direito */}
      <div className="flex items-center gap-4 flex-1 justify-end text-center">
        {/* Ícone de notificações */}
        <Button variant="ghost" size="icon" onClick={() => setNotificacoesOpen(true)}>
          <Bell className="h-5 w-5" />
        </Button>
        <Notificacoes open={notificacoesOpen} onOpenChange={setNotificacoesOpen} />
        

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="font-medium">Nome do Usuário</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.location.href = "/dados"}>Conta</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = "/configuracoes"}>Configurações</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}