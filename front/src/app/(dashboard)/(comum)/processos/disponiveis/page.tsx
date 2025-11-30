'use client'

import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProcessosDisponiveisList from '@/components/processos/ProcessosDisponiveisList'

export default function ProcessosDisponiveisPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirecionar clientes para página de processos pessoais
    if (user && user.client === true) {
      router.push('/processos')
    }
  }, [user, router])

  // Só renderizar para advogados
  if (!user || user.client === true) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <ProcessosDisponiveisList />
    </div>
  )
}