"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { Navbar } from "../comum/navbar";
import { useAuthStore, useProfileStore } from "@/store";
import { ProfileAlertBanner } from "../ui/profile-alert-banner";
import { AdvogadoLayout } from "./AdvogadoLayout";

interface RootLayoutProps {
    mobileComponent?: React.ReactNode;
    desktopComponent?: React.ReactNode;
    hideNavbar?: boolean;
    hideFooter?: boolean;
    component?: React.ReactNode;
}

export function RootLayout({ 
    mobileComponent, 
    desktopComponent, 
    hideNavbar = false, 
    hideFooter = false,
    component
}: RootLayoutProps) {
    const { isMobile } = useResponsive();
    const { isAuthenticated, user } = useAuthStore();
    const { pendente } = useProfileStore();
    const isAdvogado = user && !user.client;

    if (component) {
        if (isAdvogado && !isMobile) {
            return (
                <AdvogadoLayout hideNavbar={hideNavbar}>
                    {component}
                </AdvogadoLayout>
            );
        }
        
        return (
            <div className="min-h-screen bg-background">
                {!hideNavbar && <Navbar />}
                <div className={`${!hideNavbar && isMobile ? "mt-16" : ""} ${!hideFooter && isMobile ? "mb-16" : ""} px-4`}>
                    {isAuthenticated && pendente && <ProfileAlertBanner />}
                    {component}
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="min-h-screen bg-background">
                {!hideNavbar && <Navbar />}
                <div className={`${!hideNavbar ? "mt-16" : ""} ${!hideFooter ? "mb-16" : ""} px-4`}>
                    {isAuthenticated && pendente && <ProfileAlertBanner />}
                    {mobileComponent}
                </div>
            </div>
        );
    }

    if (isAdvogado) {
        return (
            <AdvogadoLayout hideNavbar={hideNavbar}>
                {desktopComponent}
            </AdvogadoLayout>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {!hideNavbar && <Navbar />}
            <div className="mx-auto p-4">
                {isAuthenticated && pendente && <ProfileAlertBanner />}
                {desktopComponent}
            </div>
        </div>
    );
} 