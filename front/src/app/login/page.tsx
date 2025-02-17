"use client"

import { LoginForm } from "@/components/login/login-form"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./bg-login.jpg)', filter: 'brightness(0.4)' }}></div>
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        
        <LoginForm />
      </div>
    </div>
  )
}
