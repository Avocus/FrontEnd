export type UrgenciaLevel = "baixa" | "media" | "alta"

export const getUrgenciaLabel = (urgencia: UrgenciaLevel) => {
  const labels: Record<UrgenciaLevel, string> = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
  }
  return labels[urgencia]
}

export const getUrgenciaStyles = (urgencia: UrgenciaLevel) => {
  const styles: Record<UrgenciaLevel, { pill: string; text: string; dot: string }> = {
    baixa: {
      pill: "text-green-600 bg-green-50 border-green-200",
      text: "text-green-600",
      dot: "bg-green-500"
    },
    media: {
      pill: "text-yellow-600 bg-yellow-50 border-yellow-200",
      text: "text-yellow-600",
      dot: "bg-yellow-500"
    },
    alta: {
      pill: "text-red-600 bg-red-50 border-red-200",
      text: "text-red-600",
      dot: "bg-red-500"
    }
  }

  return styles[urgencia]
}
