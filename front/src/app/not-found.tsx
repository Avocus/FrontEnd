import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Ops! Página não encontrada</h2>
          <p className="text-muted-foreground">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Link href="/home" className="mt-8 inline-block">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  )
} 