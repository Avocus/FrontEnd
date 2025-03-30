import React, { ReactNode, useState, useEffect } from 'react';
import { NavbarWeb } from '../comum/navbarWeb';
import { Sidebar } from '../comum/sidebar/Sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { ChatAvocuss } from '../comum/chatAvocuss';
import { ProfileAlertBanner } from '../ui/profile-alert-banner';
import { useAuthStore, useProfileStore } from '@/store';
import { Navbar } from '../comum/navbar';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
}

export function AppLayout({ children, hideNavbar = false }: AppLayoutProps) {
  const { config, isMobile, toggleSidebar } = useLayout();
  const [ chatOpen, setChatOpen ] = React.useState(false);
  const { isAuthenticated } = useAuthStore();
  const { pendente } = useProfileStore();
  const pathname = usePathname() || '';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determinamos qual componente de navbar mostrar
  const NavbarComponent = isMobile ? Navbar : NavbarWeb;

  // Se o componente não está montado no cliente, renderizamos um layout simplificado
  if (!isMounted) {
    return (
      <div className="flex h-screen bg-background">
        {config.showNavbar && !hideNavbar && (
          <div className="animate-pulse h-16 bg-muted mb-4"></div>
        )}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  if (isAuthenticated && config.showSidebar && !isMobile) {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          activePath={pathname} 
          setChatOpen={setChatOpen} 
          collapsed={config.sidebarCollapsed}
          onCollapsedChange={toggleSidebar}
        />
        
        {/* Chat Component */}
        <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          {config.showNavbar && !hideNavbar && (
            <NavbarWeb 
              showFullNavigation={false} 
              showLogo={config.sidebarCollapsed}
            />
          )}
          
          <div className="mx-4">
            {/* Alert Banner */}
            {isAuthenticated && pendente && <ProfileAlertBanner />}
          </div>
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Layout para clientes ou quando o usuário não é advogado
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
      {config.showNavbar && !hideNavbar && <NavbarComponent showFullNavigation={true} showLogo={true} />}

      {/* Alert Banner */}
      {isAuthenticated && pendente && <ProfileAlertBanner />}

      {/* Page Content */}
      <main className={`flex-1 overflow-auto ${isMobile && config.showNavbar && !hideNavbar ? 'mt-16' : ''} ${isMobile && config.showFooter ? 'mb-16' : ''}`}>
        {children}
      </main>
    </div>
  );
} 