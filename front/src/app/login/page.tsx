"use client"

import { LoginForm } from "@/components/login/login-form"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import AuthGuard from "@/components/auth/AuthGuard"

function LoginContent() {
  const searchParams = useSearchParams()
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)

  useEffect(() => {
    // Verificar se o parâmetro expired está presente na URL
    if (searchParams) {
      const expired = searchParams.get('expired')
      setShowExpiredMessage(expired === 'true')
    }
  }, [searchParams])

  return (
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
  )
}

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/home">
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-login.jpg)' }}></div>
        <Suspense fallback={<div>Carregando...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </AuthGuard>
  )
}
