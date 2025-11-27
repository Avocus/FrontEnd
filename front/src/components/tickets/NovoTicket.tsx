"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import NovoTicketForm from "./NovoTicketForm"
import { useLayout } from "@/contexts/LayoutContext"
import { useAuthStore } from "@/store"

export default function NovoTicket() {
  const { isAdvogado } = useLayout()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <Link href="/processos" className="mb-6 inline-block">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Novo Ticket de Solicitação</h1>
              <p className="text-muted-foreground">Preencha os detalhes da sua solicitação jurídica</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <FileText className="h-3 w-3 mr-1" />
            Ticket
          </Badge>
        </div>

        <NovoTicketForm />
      </div>
    </div>
  )
}