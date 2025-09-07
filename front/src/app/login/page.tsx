"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { useLayout } from "@/contexts/LayoutContext"
import { LoginForm } from '@/components/login/LoginForm'

function LoginContent() {
  const searchParams = useSearchParams()
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)
  const { updateConfig } = useLayout();
  
  useEffect(() => {
    if (searchParams) {
      const expired = searchParams.get('expired')
      setShowExpiredMessage(expired === 'true')
    }
  }, [searchParams])

  const { updateAuth } = useAuth();

  useEffect(() => {
    updateAuth({
      requireAuth: false,
      redirectTo: "/home"
    });
  }, [updateAuth]);

  useEffect(() => {
    updateConfig({
      showNavbar: false,
      showSidebar: false,
      showFooter: false
    });
  }, [updateConfig]); 

  return (
    <AuthGuard>
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        {showExpiredMessage && (
          <Alert variant="destructive" className="animate-fadeIn">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sua sessão expirou. Por favor, faça login novamente.
          </AlertDescription>
        </Alert>
      )}
      <LoginForm />
    </div>
    </AuthGuard>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-login.jpg)' }}></div>
      <Suspense fallback={<div className="flex items-center justify-center">Carregando...</div>}>
          <LoginContent />
      </Suspense>
    </div>
  )
}
