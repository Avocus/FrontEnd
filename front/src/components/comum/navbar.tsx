import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Menu, Home, User, Calendar, BookOpen, Video } from "lucide-react";
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
import { FooterMobile } from "./footerMobile";

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
    { label: "Agenda", href: "/agenda", icon: <Calendar className="h-5 w-5" /> },
    // { label: "Serviços", href: "#" },
    // { label: "Chat", onClick: () => setChatOpen(true), icon: <MessageCircle className="h-5 w-5 mr-2" /> },
    { label: "Biblioteca", href: "/biblioteca", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Videoteca", href: "/videoteca", icon: <Video className="h-5 w-5" /> },
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
        <nav className="w-full fixed top-0 p-2 bg-secondary text-secondary-foreground flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <div className="bg-secondary rounded-2xl p-1 text-primary">
              <h1 className="text-lg font-bold" onClick={() => navigateTo('/conta')}>
                Mr. {user ? formatName(user.nome || '') : 'Usuário'}
              </h1>
            </div>
          </div>
          <div className="flex gap-3 pr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex flex-col items-center p-6 bg-tertiary rounded-2xl"
              onClick={() => setNotificacoesOpen(true)}
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-16
                 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                  className="flex flex-col items-center p-6 bg-tertiary rounded-2xl"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item, index) => (
                    item.onClick ? (
                      <Button
                        key={index}
                        variant="ghost"
                        className="flex items-center justify-start"
                        onClick={() => {
                          item?.onClick?.();
                          setMenuOpen(false);
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    ) : (
                      <Link
                        key={index}
                        href={item.href || "#"}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start w-full"
                        >
                          {item.icon}
                          {item.label}
                        </Button>
                      </Link>
                    )
                  ))}
                  <div className="h-px bg-border my-4" />
                  {profileItems.map((item, index) => (
                    item.onClick ? (
                      <Button
                        key={index}
                        variant="ghost"
                        className="flex items-center justify-start"
                        onClick={() => {
                          item.onClick();
                          setMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <Link
                        key={index}
                        href={item.href || "#"}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start w-full"
                        >
                          {item.label}
                        </Button>
                      </Link>
                    )
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
        <FooterMobile />

[]      </>
    );
  }

  // Versão Web
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/home" className="text-xl font-bold flex-1 text-start cursor-pointer">
        Avocuss
      </Link>

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
                    onClick={item.onClick}
                  >
                    {item.href ? (
                      <Link href={item.href} className="w-full">
                        {item.label}
                      </Link>
                    ) : (
                      item.label
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <ThemeToggle />
            
            <Link href="/login">
              <Button>
                Entrar
              </Button>
            </Link>
          </>
        )}
      </div>
      <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
    </nav>
  );
}); 