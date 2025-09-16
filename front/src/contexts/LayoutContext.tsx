"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store';
import { useResponsive } from '@/hooks/useResponsive';

interface LayoutConfig {
  showNavbar: boolean;
  showSidebar: boolean;
  showFooter: boolean;
  sidebarCollapsed: boolean;
}

interface LayoutContextProps {
  config: LayoutConfig;
  updateConfig: (newConfig: Partial<LayoutConfig>) => void;
  toggleSidebar: () => void;
  isAdvogado: boolean;
  isCliente: boolean;
  isMobile: boolean;
}

const defaultConfig: LayoutConfig = {
  showNavbar: true,
  showSidebar: false,
  showFooter: true,
  sidebarCollapsed: false,
};

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const { isMobile } = useResponsive();
  const isAdvogado = Boolean(user && !user.client);
  const isCliente = Boolean(user && user.client);
  const [isMounted, setIsMounted] = useState(false);
  
  // Usar useMemo para evitar recálculos desnecessários
  const initialConfig = useMemo(() => ({
    ...defaultConfig,
    showSidebar: (isAdvogado || isCliente) && !isMobile,
    // Evitamos acessar window durante SSR
    sidebarCollapsed: isMobile
  }), [isAdvogado, isCliente, isMobile]);
  
  // Configuração padrão de layout baseada no usuário
  const [config, setConfig] = useState<LayoutConfig>(initialConfig);

  // Verificar se estamos no cliente após a montagem do componente
  useEffect(() => {
    setIsMounted(true);
    
    // Atualizar configurações com base no tamanho da janela somente no cliente
    setConfig(prevConfig => ({
      ...prevConfig,
      sidebarCollapsed: prevConfig.sidebarCollapsed || window.innerWidth < 1024
    }));
  }, []);

  // Re-aplicar configurações ao mudar tipo de usuário ou dispositivo
  useEffect(() => {
    if (!isMounted) return;
    
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      
      // Só atualizar se mudou para evitar re-renders em cascata
      if (prevConfig.showSidebar !== ((isAdvogado || isCliente) && !isMobile)) {
        newConfig.showSidebar = (isAdvogado || isCliente) && !isMobile;
      }
      
      // Atualizar collapse da sidebar baseado no dispositivo
      const shouldCollapse = isMobile || window.innerWidth < 1024;
      if (prevConfig.sidebarCollapsed !== shouldCollapse) {
        newConfig.sidebarCollapsed = shouldCollapse;
      }
      
      return newConfig;
    });
  }, [isAdvogado, isCliente, isMobile, isMounted]);

  const updateConfig = useCallback((newConfig: Partial<LayoutConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig,
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setConfig(prevConfig => ({
      ...prevConfig,
      sidebarCollapsed: !prevConfig.sidebarCollapsed,
    }));
  }, []);

  // Usar useMemo para evitar recriação do objeto context a cada render
  const contextValue = useMemo(() => ({
    config,
    updateConfig,
    toggleSidebar,
    isAdvogado,
    isCliente,
    isMobile,
  }), [config, updateConfig, toggleSidebar, isAdvogado, isCliente, isMobile]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout deve ser usado dentro de um LayoutProvider');
  }
  return context;
} 