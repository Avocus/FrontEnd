"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

// Componente para versão mobile
const BibliotecaMobile = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Biblioteca</h1>
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Documentos Recentes</h2>
        <ul className="space-y-2">
          <li className="border-b pb-2">Contrato de Prestação de Serviços</li>
          <li className="border-b pb-2">Petição Inicial - Modelo</li>
          <li className="border-b pb-2">Recurso de Apelação</li>
        </ul>
      </div>
      
      <div className="bg-card rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Categorias</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background p-3 rounded text-center">Civil</div>
          <div className="bg-background p-3 rounded text-center">Penal</div>
          <div className="bg-background p-3 rounded text-center">Trabalhista</div>
          <div className="bg-background p-3 rounded text-center">Administrativo</div>
        </div>
      </div>
    </div>
  </div>
);

// Componente para versão web
const BibliotecaWeb = () => (
  <div className="container p-6">
    <h1 className="text-3xl font-bold mb-6">Biblioteca Jurídica</h1>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg p-6 shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Documentos Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Contrato de Prestação de Serviços</h3>
              <p className="text-sm text-muted-foreground">Atualizado em 10/06/2023</p>
              <div className="mt-2 flex justify-end">
                <button className="text-primary text-sm">Visualizar</button>
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Petição Inicial - Modelo</h3>
              <p className="text-sm text-muted-foreground">Atualizado em 15/08/2023</p>
              <div className="mt-2 flex justify-end">
                <button className="text-primary text-sm">Visualizar</button>
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Recurso de Apelação</h3>
              <p className="text-sm text-muted-foreground">Atualizado em 22/09/2023</p>
              <div className="mt-2 flex justify-end">
                <button className="text-primary text-sm">Visualizar</button>
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Contestação - Direito do Consumidor</h3>
              <p className="text-sm text-muted-foreground">Atualizado em 05/10/2023</p>
              <div className="mt-2 flex justify-end">
                <button className="text-primary text-sm">Visualizar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-6 shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Categorias</h2>
          <ul className="space-y-2">
            <li className="p-3 bg-background rounded-lg hover:bg-primary/10 cursor-pointer">Direito Civil</li>
            <li className="p-3 bg-background rounded-lg hover:bg-primary/10 cursor-pointer">Direito Penal</li>
            <li className="p-3 bg-background rounded-lg hover:bg-primary/10 cursor-pointer">Direito Trabalhista</li>
            <li className="p-3 bg-background rounded-lg hover:bg-primary/10 cursor-pointer">Direito Administrativo</li>
            <li className="p-3 bg-background rounded-lg hover:bg-primary/10 cursor-pointer">Direito Tributário</li>
            <li className="p-3 bg-background rounded-lg hover:bg-primary/10 cursor-pointer">Direito do Consumidor</li>
          </ul>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Filtros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
              <select className="w-full p-2 border rounded-md">
                <option>Todos</option>
                <option>Contratos</option>
                <option>Petições</option>
                <option>Recursos</option>
                <option>Pareceres</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <select className="w-full p-2 border rounded-md">
                <option>Qualquer data</option>
                <option>Última semana</option>
                <option>Último mês</option>
                <option>Último ano</option>
              </select>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function BibliotecaPage() {
  const { updateConfig, isMobile, isAdvogado } = useLayout();
  
  useEffect(() => {
    // Configuração específica para a página Biblioteca
    updateConfig({
      showNavbar: true,
      showSidebar: isAdvogado, // Mostrar sidebar apenas para advogados
      showFooter: true
    });
  }, [updateConfig, isAdvogado]);
  
  return (
    <AppLayout>
      {isMobile ? <BibliotecaMobile /> : <BibliotecaWeb />}
    </AppLayout>
  );
}
