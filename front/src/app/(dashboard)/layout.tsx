"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
        setIsLoading(false);
    }, [isAuthenticated, router]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>{children}</>
    );
}
