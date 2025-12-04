"use client";

import ResetPassword from "@/components/login/ResetPassword";
import { useSearchParams } from "next/navigation";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, Suspense } from "react";
import { useAuthStore } from "@/store";
import { useRouter } from 'next/navigation';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");
    const { updateConfig } = useLayout();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
      return;
    }
    updateConfig({
      showNavbar: false,
      showSidebar: false,
      showFooter: false
    });
  }, [updateConfig, router, isAuthenticated]);

    return (
        <div className="w-full h-screen flex items-center justify-center p-4 absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-login.webp)' }}>
            {!token ? (
                <p className="text-red-500 text-lg">
                    Token inválido ou ausente.
                </p>
            ) : (
                <ResetPassword token={token} />
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
