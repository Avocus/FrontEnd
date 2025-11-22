import toast from 'react-hot-toast';

type StatusType = 'rascunho' | 'em_andamento' | 'aguardando_dados' | 'em_julgamento' | 'concluido' | 'arquivado' | string
type UrgenciaLevel = 'baixa' | 'media' | 'alta'

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  rascunho: { background: '#FEF3C7', color: '#92400e' }, // yellow-50 / amber-700
  em_andamento: { background: '#EFF6FF', color: '#1E3A8A' }, // blue-50 / blue-800
  aguardando_dados: { background: '#FFF7ED', color: '#92400e' }, // orange-like
  em_julgamento: { background: '#F5F3FF', color: '#5B21B6' }, // purple
  concluido: { background: '#ECFDF5', color: '#065F46' }, // green
  arquivado: { background: '#FEF2F2', color: '#991B1B' }, // red
  pendente: { background: '#EFF6FF', color: '#1E3A8A' }, // similar to em_andamento
}

const URGENCIA_STYLES: Record<UrgenciaLevel, { background: string; color: string; icon: string }> = {
  baixa: { background: '#ECFDF5', color: '#065F46', icon: '✅' },
  media: { background: '#FFFBEB', color: '#92400e', icon: '⚠️' },
  alta: { background: '#FFF1F2', color: '#9F1239', icon: '🚨' },
}

export const useToast = () => {
  const showSuccess = (message: string) => toast.success(message)
  const showError = (message: string) => toast.error(message)
  const showInfo = (message: string) => toast(message)

  const showStatus = (status: StatusType, message: string) => {
    const key = (status || '').toString().toLowerCase()
    const style = STATUS_STYLES[key] || { background: '#F3F4F6', color: '#111827' }
    toast(message, {
      style: {
        background: style.background,
        color: style.color,
        border: '1px solid rgba(0,0,0,0.04)',
      }
    })
  }

  const showUrgencia = (urgencia: UrgenciaLevel, message: string) => {
    const style = URGENCIA_STYLES[urgencia]
    toast(`${style.icon}  ${message}`, {
      style: {
        background: style.background,
        color: style.color,
        border: '1px solid rgba(0,0,0,0.04)'
      }
    })
  }

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    status: showStatus,
    urgencia: showUrgencia,
  }
}
