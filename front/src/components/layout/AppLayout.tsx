import React, { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from '../comum/sidebar/Sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { ChatAvocuss } from '../comum/chatAvocuss';
import { ProfileAlertBanner } from '../ui/profile-alert-banner';
import { useAuthStore, useProfileStore } from '@/store';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Navbar } from '../comum/navbar';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
}

export function AppLayout({ children, hideNavbar = false }: AppLayoutProps) {
  const { config, isMobile, toggleSidebar, isCliente } = useLayout();
  const [ chatOpen, setChatOpen ] = React.useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { pendente } = useProfileStore();
  const { connectWebSocket, disconnectWebSocket, loadNotifications } = useNotificationStore();
  const pathname = usePathname() || '';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Conectar WebSocket e carregar notificações quando usuário estiver autenticado
  useEffect(() => {
    console.log('🔍 Verificando autenticação...', { isAuthenticated, userId: user?.id });
    
    if (isAuthenticated && user?.id) {
      console.log('🔔 Iniciando conexão WebSocket de notificações para usuário:', user.id);
      
      // Carregar notificações existentes
      loadNotifications().catch(err => {
        console.error('❌ Erro ao carregar notificações:', err);
      });
      
      // Conectar WebSocket para notificações em tempo real
      connectWebSocket(user.id.toString());

      return () => {
        console.log('🔌 Desconectando WebSocket de notificações');
        disconnectWebSocket();
      };
    } else {
      console.log('⏳ Aguardando autenticação ou userId...');
    }
  }, [isAuthenticated, user?.id, loadNotifications, connectWebSocket, disconnectWebSocket]);


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
          isClient={isCliente}
        />
        
        {/* Chat Component */}
        <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          {config.showNavbar && !hideNavbar && (
            <Navbar 
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
      {config.showNavbar && !hideNavbar && <Navbar showFullNavigation={true} showLogo={true} />}

      {/* Alert Banner */}
      {isAuthenticated && pendente && <ProfileAlertBanner />}

      {/* Page Content */}
      <main className={`flex-1 overflow-auto ${isMobile && config.showNavbar && !hideNavbar ? 'mt-16' : ''} ${isMobile && config.showFooter ? 'mb-16' : ''}`}>
        {children}
      </main>
    </div>
  );
} 