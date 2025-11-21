import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { ChatAvocuss } from "./chatAvocuss"; // Importação do ChatAvocuss
import { Notificacoes } from "./notificacoes";
import { ThemeToggle } from "./ThemeToggle"; // Importação do ThemeToggle
import { NotificationButton } from "./NotificationButton"; // Importação do NotificationButton
import { useNotificationStore, useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NavItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

interface NavbarWebProps {
  showFullNavigation?: boolean;
  showLogo?: boolean;
}

export const NavbarWeb = memo(function NavbarWeb({ showFullNavigation = true, showLogo = true }: NavbarWebProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);
  const { notificacoes } = useNotificationStore();
  const unreadCount = notificacoes.filter(n => !n.lida).length;
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const navItems: NavItem[] = user ? [
    { label: "Agenda", href: "/agenda" },
    { label: "Serviços", href: "#" },
    { label: "Chat", onClick: () => setChatOpen(true) },
    { label: "Biblioteca", href: "/biblioteca" },
    { label: "Videoteca", href: "/videoteca" },
    { label: "Casos", href: "/casos" },
  ] : [
    { label: "Chat", onClick: () => setChatOpen(true) },
    { label: "Biblioteca", href: "/biblioteca" },
    { label: "Videoteca", href: "/videoteca" },
  ];

  const profileItems = [
    { label: "Conta", href: "/conta" },
    { label: "Configurações", href: "/configuracoes" },
    { label: "Sair", onClick: () => handleLogout() },
  ];

  const handleLogout = useCallback(() => {
    logout(); // Chama a função de logout do useAuthStore
    router.push("/login"); // Redireciona para a página de login
  }, [logout, router]);

  const formatName = useCallback((name: string) => {
    if (!name) return 'Usuário';

    const firstName = name.split(" ")[0];

    return firstName.length > 20 ? firstName.slice(0, 20) + "..." : firstName;
  }, []);

  const goToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      {/* Nome no canto esquerdo */}
      {showLogo ? (
        <div className="text-xl font-bold flex-1 text-start cursor-pointer" onClick={goToHome}>Avocuss</div>
      ) : (
        <div className="flex-1"></div> /* Espaçador para manter o layout quando o logo está escondido */
      )}

      {/* Abas de navegação no centro */}
      {showFullNavigation && (
        <NavigationMenu className="flex-1 text-center">
          <NavigationMenuList className="inline-flex">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.onClick ? (
                  <div onClick={item.onClick} className="px-4 py-2 cursor-pointer">
                    {item.label}
                  </div>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link href={item.href || "#"} className="px-4 py-2">
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}
      <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />

      {/* Seção do perfil no canto direito */}
      <div className="flex items-center gap-4 flex-1 justify-end text-center">
        {user ? (
          <>
            {/* Botão de demonstração de notificações */}
            <NotificationButton />
            
            {/* Ícone de notificações */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setNotificacoesOpen(true)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>
            <Notificacoes open={notificacoesOpen} onOpenChange={setNotificacoesOpen} />
            
            {/* Toggle de tema */}
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="font-medium">{formatName(user?.nome || '')}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {profileItems.map((item, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    onClick={item.onClick || (item.href ? () => router.push(item.href) : undefined)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            {/* Toggle de tema */}
            <ThemeToggle />
            
            {/* Botão de login */}
            <Button onClick={() => router.push("/login")}>
              Entrar
            </Button>
          </>
        )}
      </div>
    </nav>
  );
});