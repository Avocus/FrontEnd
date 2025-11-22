import { TimelineEntry } from "@/types/entities";
import { getStatusLabel } from "@/utils/casoUtils";

interface TimelineComponentProps {
  timeline: TimelineEntry[];
  isAdvogado?: boolean;
}

export function TimelineComponent({ timeline, isAdvogado = false }: TimelineComponentProps) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Andamentos do Processo</h2>
      <div className="space-y-4">
        {timeline && timeline.length > 0 ? (
          <div className="space-y-6">
            {[...timeline].reverse().map((entry, index) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    entry.autor === "cliente" ? "bg-blue-500" :
                    entry.autor === "advogado" ? "bg-green-500" : "bg-gray-500"
                  }`}></div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.autor === "cliente" ? "bg-blue-100 text-blue-800" :
                      entry.autor === "advogado" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {entry.autor === "cliente" ? "Cliente" :
                       entry.autor === "advogado" ? "Advogado" : "Sistema"}
                    </span>
                  </div>
                  <p className="font-medium mb-1">{entry.descricao}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {entry.statusAnterior ? `${getStatusLabel(entry.statusAnterior, isAdvogado)} → ` : ""}{getStatusLabel(entry.novoStatus, isAdvogado)}
                  </p>
                  {entry.observacoes && (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      {entry.observacoes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timeline padrão quando não há entradas específicas */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <div className="pb-8">
                <p className="text-sm text-muted-foreground">
                  Caso solicitado
                </p>
                <p className="font-medium">Caso solicitado</p>
                <p className="text-sm text-muted-foreground">Solicitação de caso enviada com sucesso</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}