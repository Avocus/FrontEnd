"use client";

import { ThemeProvider } from "../../utils/theme-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <AuthProvider>
          <div className="">
            <AppLayout>
              {children}
            </AppLayout>
          </div>
        </AuthProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
} 