export type UrgenciaLevel = "BAIXA" | "MEDIA" | "ALTA"

export const getUrgenciaLabel = (urgencia: UrgenciaLevel) => {
  const labels: Record<UrgenciaLevel, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
  }
  return labels[urgencia]
}

export const getUrgenciaStyles = (urgencia: UrgenciaLevel) => {
  const styles: Record<UrgenciaLevel, { pill: string; text: string; dot: string }> = {
    BAIXA: {
      pill: "text-green-600 bg-green-50 border-green-200",
      text: "text-green-600",
      dot: "bg-green-500"
    },
    MEDIA: {
      pill: "text-yellow-600 bg-yellow-50 border-yellow-200",
      text: "text-yellow-600",
      dot: "bg-yellow-500"
    },
    ALTA: {
      pill: "text-red-600 bg-red-50 border-red-200",
      text: "text-red-600",
      dot: "bg-red-500"
    }
  }

  return styles[urgencia]
}
