'use client'

import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TicketsPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Verificar se é advogado baseado nas roles
      const isAdvogado = user.roles?.some(role => role.name === 'ADVOGADO')

      if (isAdvogado) {
        // Advogados veem tickets disponíveis
        router.replace('/tickets/disponiveis')
      } else {
        // Clientes vão para criação de tickets
        router.replace('/tickets/criar')
      }
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirecionando...</p>
      </div>
    </div>
  )
}