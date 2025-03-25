import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Menu, MessageCircle, Settings, Home, User, X } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { ChatAvocuss } from "./chatAvocuss";
import { Notificacoes } from "./notificacoes";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationButton } from "./NotificationButton";
import { useNotificationStore, useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";

type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

// Usar memo para evitar re-renderizações desnecessárias
export const Navbar = memo(function Navbar() {
  const [chatOpen, setChatOpen] = useState(false);
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { isMobile } = useResponsive();
  const { notificacoes } = useNotificationStore();
  const unreadCount = notificacoes.filter(n => !n.lida).length;
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const navItems: NavItem[] = [
    { label: "Home", href: "/home", icon: <Home className="h-5 w-5 mr-2" /> },
    { label: "Agenda", href: "/agenda" },
    { label: "Serviços", href: "#" },
    { label: "Chat", onClick: () => setChatOpen(true), icon: <MessageCircle className="h-5 w-5 mr-2" /> },
    { label: "Biblioteca", href: "/biblioteca" },
    { label: "Videoteca", href: "/videoteca" },
    { label: "Casos", href: "/casos", icon: <User className="h-5 w-5 mr-2" /> },
  ];

  const profileItems = [
    { label: "Conta", href: "/conta" },
    { label: "Configurações", href: "/configuracoes" },
    { label: "Sair", onClick: () => handleLogout() },
  ];

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const formatName = useCallback((name: string) => {
    if (!name) return 'Usuário';
    const firstName = name.split(" ")[0];
    return firstName.length > 20 ? firstName.slice(0, 20) + "..." : firstName;
  }, []);

  const navigateTo = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  // Versão Mobile
  if (isMobile) {
    return (
      <>
        <nav className="w-full fixed top-0 p-2 bg-secondary text-secondary-foreground flex justify-between items-center rounded-b-2xl z-50">
          <div className="flex items-center gap-2">
            <div className="bg-tertiary rounded-full p-2">
              <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigateTo('/conta')}>
                {user ? formatName(user.nome) : 'Usuário'}
              </h1>
            </div>
          </div>
          <div className="flex gap-3 pr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
              onClick={() => setNotificacoesOpen(true)}
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            <Notificacoes open={notificacoesOpen} onOpenChange={setNotificacoesOpen} />
            
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="flex items-center justify-start"
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.href) {
                          navigateTo(item.href);
                        }
                        setMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                  <div className="h-px bg-border my-4" />
                  {profileItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="flex items-center justify-start"
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.href) {
                          navigateTo(item.href);
                        }
                        setMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
        
        <footer className="w-full fixed bottom-0 bg-secondary text-secondary-foreground flex justify-around p-2 rounded-t-xl">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
            onClick={() => setChatOpen(true)}
          >
            <MessageCircle className="w-8 h-8 text-secondary-foreground" />
            <span className="text-xs text-secondary-foreground">Chat</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
            onClick={() => navigateTo('/home')}
          >
            <Home className="w-8 h-8 text-secondary-foreground" />
            <span className="text-xs text-secondary-foreground">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
            onClick={() => navigateTo('/casos')}
          >
            <User className="w-8 h-8 text-secondary-foreground" />
            <span className="text-xs text-secondary-foreground">Casos</span>
          </Button>
        </footer>
        
        <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
      </>
    );
  }

  // Versão Web
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="text-xl font-bold flex-1 text-start cursor-pointer" onClick={() => navigateTo('/home')}>
        Avocuss
      </div>

      <NavigationMenu className="flex-1 text-center">
        <NavigationMenuList className="inline-flex">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.onClick ? (
                <div onClick={item.onClick} className="px-4 py-2 cursor-pointer">
                  {item.label}
                </div>
              ) : (
                <Link href={item.href || "#"} legacyBehavior passHref>
                  <NavigationMenuLink className="px-4 py-2">
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex items-center gap-4 flex-1 justify-end text-center">
        {user ? (
          <>
            <NotificationButton />
            
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
                    onClick={item.onClick || (item.href ? () => navigateTo(item.href) : undefined)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <ThemeToggle />
            
            <Button onClick={() => navigateTo("/login")}>
              Entrar
            </Button>
          </>
        )}
      </div>
      <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
    </nav>
  );
}); 