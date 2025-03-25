import React, { ReactNode, useState, useEffect } from 'react';
import { NavbarWeb } from '../comum/navbarWeb';
import { AdvogadoSidebar } from '../comum/sidebar/AdvogadoSidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { ChatAvocuss } from '../comum/chatAvocuss';
import { ProfileAlertBanner } from '../ui/profile-alert-banner';
import { useAuthStore, useProfileStore } from '@/store';
import { Navbar } from '../comum/navbar';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { config, isAdvogado, isMobile, toggleSidebar } = useLayout();
  const [chatOpen, setChatOpen] = React.useState(false);
  const { isAuthenticated } = useAuthStore();
  const { pendente } = useProfileStore();
  const pathname = usePathname() || '';
  const [isMounted, setIsMounted] = useState(false);

  // Usamos useEffect para controlar quando o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determinamos qual componente de navbar mostrar
  const NavbarComponent = isMobile ? Navbar : NavbarWeb;

  // Se o componente não está montado no cliente, renderizamos um layout simplificado
  if (!isMounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 overflow-hidden">
          <div className="animate-pulse h-16 bg-muted mb-4"></div>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Layout para advogados (com sidebar) vs clientes (sem sidebar)
  if (isAdvogado) {
    return (
      <div className="flex h-screen bg-background">
        {/* Sidebar - Mostrada apenas quando config.showSidebar é true */}
        {config.showSidebar && (
          <AdvogadoSidebar
            activePath={pathname}
            setChatOpen={setChatOpen}
            collapsed={config.sidebarCollapsed}
            onCollapsedChange={toggleSidebar}
            className="z-10"
          />
        )}

        {/* Chat Component */}
        <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          {config.showNavbar && (
            <NavbarComponent
              showFullNavigation={!config.showSidebar}
              showLogo={!config.showSidebar || config.sidebarCollapsed}
            />
          )}

          {/* Alert Banner */}
          {isAuthenticated && pendente && <ProfileAlertBanner />}

          {/* Page Content */}
          <main className={`flex-1 overflow-auto p-4 md:p-6 ${isMobile && config.showNavbar ? 'mt-16' : ''} ${isMobile && config.showFooter ? 'mb-16' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Layout para clientes (ou quando o usuário não é advogado)
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
      {config.showNavbar && <NavbarComponent showFullNavigation={true} showLogo={true} />}

      {/* Alert Banner */}
      {isAuthenticated && pendente && <ProfileAlertBanner />}

      {/* Page Content */}
      <main className={`flex-1 overflow-auto p-4 md:p-6 ${isMobile && config.showNavbar ? 'mt-16' : ''} ${isMobile && config.showFooter ? 'mb-16' : ''}`}>
        {children}
      </main>
    </div>
  );
} 