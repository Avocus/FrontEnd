import { useState, useEffect } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface UseResponsiveOptions {
  defaultBreakpoint?: number;
}

export function useResponsive(options: UseResponsiveOptions = {}) {
  const { defaultBreakpoint = 768 } = options;
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Inicializa o estado apenas após montagem no cliente
    setIsMobile(window.innerWidth <= defaultBreakpoint);
    setWidth(window.innerWidth);

    const mediaQuery = window.matchMedia(`(max-width: ${defaultBreakpoint}px)`);
    
    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= defaultBreakpoint);
    };

    handleMediaChange(mediaQuery);
    
    // Usar a API correta com fallback para compatibilidade
    try {
      mediaQuery.addEventListener("change", handleMediaChange);
    } catch (e) {
      // Fallback para navegadores mais antigos
      try {
        // @ts-ignore - Para browsers antigos
        mediaQuery.addListener(handleMediaChange);
      } catch (error) {
        console.error("Não foi possível adicionar listener para o mediaQuery:", error);
      }
    }
    
    window.addEventListener("resize", handleResize);

    return () => {
      try {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } catch (e) {
        try {
          // @ts-ignore - Para browsers antigos
          mediaQuery.removeListener(handleMediaChange);
        } catch (error) {
          console.error("Não foi possível remover listener do mediaQuery:", error);
        }
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [defaultBreakpoint]);

  // Calcular breakpoints apenas no cliente e quando o componente estiver montado
  const breakpoints = isMounted ? {
    xs: width < 576,
    sm: width >= 576 && width < 768,
    md: width >= 768 && width < 992,
    lg: width >= 992 && width < 1200,
    xl: width >= 1200 && width < 1600,
    "2xl": width >= 1600,
  } : {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false,
  };

  const isBreakpoint = (breakpoint: Breakpoint) => breakpoints[breakpoint];

  return {
    isMobile,
    width,
    breakpoints,
    isBreakpoint,
    isMounted,
  };
} 