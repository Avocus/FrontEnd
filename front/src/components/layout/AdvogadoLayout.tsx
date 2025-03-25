import { ReactNode, useState } from "react";
import { NavbarWeb } from "../comum/navbarWeb";
import { AdvogadoSidebar } from "../comum/sidebar/AdvogadoSidebar";
import { usePathname } from "next/navigation";
import { ChatAvocuss } from "../comum/chatAvocuss";
import { useAuthStore, useProfileStore } from "@/store";
import { ProfileAlertBanner } from "../ui/profile-alert-banner";

interface AdvogadoLayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
}

export function AdvogadoLayout({ children, hideNavbar = false }: AdvogadoLayoutProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname() || "";
  const { isAuthenticated } = useAuthStore();
  const { pendente } = useProfileStore();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdvogadoSidebar 
        activePath={pathname} 
        setChatOpen={setChatOpen} 
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      
      {/* Chat Component */}
      <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        {!hideNavbar && (
          <NavbarWeb 
            showFullNavigation={false} 
            showLogo={sidebarCollapsed}
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