import { CasoCliente, CasoAdvogado } from "@/types/entities";

interface EventosComponentProps {
  caso: CasoCliente | CasoAdvogado;
}

export function EventosComponent({ caso }: EventosComponentProps) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Eventos do Processo</h2>
      <div className="space-y-4">
        {caso.eventos && caso.eventos.length > 0 ? (
          <div className="grid gap-4">
            {caso.eventos.map((evento) => (
              <div key={evento.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: evento.cor }}
                    ></div>
                    <h3 className="font-semibold">{evento.titulo}</h3>
                  </div>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                    {evento.status}
                  </span>
                </div>
                {evento.descricao && (
                  <p className="text-sm text-muted-foreground mb-2">{evento.descricao}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Tipo:</span> {evento.tipo}
                  </div>
                  <div>
                    <span className="font-medium">Data Início:</span> {new Date(evento.dataInicio).toLocaleString('pt-BR')}
                  </div>
                  {evento.dataFim && (
                    <div>
                      <span className="font-medium">Data Fim:</span> {new Date(evento.dataFim).toLocaleString('pt-BR')}
                    </div>
                  )}
                  {evento.local && (
                    <div>
                      <span className="font-medium">Local:</span> {evento.local}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Lembrar antes:</span> {evento.diasLembrarAntes} dias
                  </div>
                  <div>
                    <span className="font-medium">Notificar por email:</span> {evento.notificarPorEmail ? 'Sim' : 'Não'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum evento cadastrado para este processo.</p>
        )}
      </div>
    </div>
  );
}