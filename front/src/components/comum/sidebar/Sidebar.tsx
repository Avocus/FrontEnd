import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Video, 
  Briefcase, 
  FilePlus, 
  MessageCircle, 
  FileText, 
  Users, 
  BarChart,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
// import { NovoCaso } from "@/components/casos/NovoCaso";

type SidebarItemProps = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  disabled?: boolean; // Adicionada a propriedade 'disabled'
};

const SidebarItem = ({ label, href, icon, active, onClick, collapsed, disabled }: SidebarItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!disabled) { // Evita ação se estiver desabilitado
      if (onClick) {
        onClick();
      } else if (href) {
        router.push(href);
      }
    }
  };
    

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 pl-2 font-normal",
        active && "bg-muted",
        collapsed && "justify-center p-2",
        disabled && "opacity-50 cursor-not-allowed" // Estilo para itens desabilitados
      )}
      onClick={handleClick}
      title={collapsed ? label : undefined}
      disabled={disabled} // Desabilita o botão
    >
      {icon}
      {!collapsed && label}
    </Button>
  );
};

interface SidebarProps {
  className?: string;
  activePath?: string;
  setChatOpen?: (open: boolean) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ 
  className, 
  activePath = "", 
  setChatOpen,
  collapsed: externalCollapsed,
  onCollapsedChange 
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use o estado controlado externamente se fornecido, caso contrário use o interno
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const toggleCollapsed = () => {
    if (onCollapsedChange) {
      onCollapsedChange(!collapsed);
    } else {
      setInternalCollapsed(!collapsed);
    }
  };

  const mainItems: SidebarItemProps[] = [
    { label: "Home", href: "/home", icon: <Home className="h-5 w-5" /> },
    { label: "Agenda", href: "/agenda", icon: <Calendar className="h-5 w-5" /> },
    { label: "Chat", icon: <MessageCircle className="h-5 w-5" />, onClick: () => setChatOpen && setChatOpen(true) },
    { label: "Biblioteca", href: "/biblioteca", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Videoteca", href: "/videoteca", icon: <Video className="h-5 w-5" /> },
  ];

  const casosItems: SidebarItemProps[] = [
    { label: "Meus Casos", href: "/casos", icon: <Briefcase className="h-5 w-5" /> },
    { label: "Novo Caso", icon: <FilePlus className="h-5 w-5" />, disabled: true }, // Atualizado
    { label: "Documentos", href: "/documentos", icon: <FileText className="h-5 w-5" /> , disabled: true },
    { label: "Clientes", href: "/clientes", icon: <Users className="h-5 w-5" />, disabled: true },
  ];

  const gerencialItems: SidebarItemProps[] = [
    { label: "Estatísticas", href: "/estatisticas", icon: <BarChart className="h-5 w-5" />, disabled: true  },
    { label: "Prazos", href: "/prazos", icon: <Clock className="h-5 w-5" /> , disabled: true },
    { label: "Configurações", href: "/configuracoes", icon: <Settings className="h-5 w-5" /> , disabled: false },
  ];

  return (
    <>
      <aside className={cn(
        "h-screen border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}>
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-lg font-bold">Avocuss</h2>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapsed}
            className={cn("ml-auto", collapsed && "mx-auto")}
            aria-label={collapsed ? "Expandir menu" : "Minimizar menu"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className={cn("py-2", collapsed ? "px-2" : "px-3")}>
            <div className="space-y-1">
              {mainItems.map((item) => (
                <SidebarItem 
                  key={item.label} 
                  {...item} 
                  active={activePath === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>

            {!collapsed && (
              <div className="mt-6">
                <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">Casos</h3>
              </div>
            )}
            <div className={cn("space-y-1", collapsed ? "mt-4" : "")}>
              {casosItems.map((item) => (
                <SidebarItem 
                  key={item.label} 
                  {...item} 
                  active={activePath === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>

            {!collapsed && (
              <div className="mt-6">
                <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">Gerencial</h3>
              </div>
            )}
            <div className={cn("space-y-1", collapsed ? "mt-4" : "")}>
              {gerencialItems.map((item) => (
                <SidebarItem 
                  key={item.label} 
                  {...item} 
                  active={activePath === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}