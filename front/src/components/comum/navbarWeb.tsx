import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Bell } from "lucide-react";
  
  export function NavbarWeb() {
    return (
      <nav className="flex items-center justify-between p-4 border-b">
        {/* Nome no canto esquerdo */}
        <div className="text-xl font-bold">Avocuss</div>
  
        {/* Abas de navegação no centro */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/processos" className="px-4 py-2">
                Processos
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/documentos" className="px-4 py-2">
                Documentos
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/advogados" className="px-4 py-2">
                Advogados
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/servicos" className="px-4 py-2">
                Serviços
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/agenda" className="px-4 py-2">
                Agenda
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/chat" className="px-4 py-2">
                Chat
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
  
        {/* Seção do perfil no canto direito */}
        <div className="flex items-center gap-4">
          {/* Ícone de notificações */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
  
          {/* Dropdown do perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="font-medium">Nome do Usuário</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Conta</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    );
  }