import { CasoCliente, CasoAdvogado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";

interface VisaoGeralComponentProps {
  caso: CasoCliente | CasoAdvogado;
  isAdvogado: boolean;
}

export function VisaoGeralComponent({ caso, isAdvogado }: VisaoGeralComponentProps) {
  return (
    <div className="space-y-6">
      {/* Seção de Ações Necessárias - específica para clientes */}
      {!isAdvogado && (caso as CasoCliente).status && (
        <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <h2 className="text-xl font-semibold mb-3 text-green-900 dark:text-green-100">📋 O que você precisa fazer</h2>
          <div className="space-y-2">
            {caso.status === StatusProcesso.RASCUNHO && (
              <p className="text-sm text-green-800 dark:text-green-200">
                • <strong>Aguardando:</strong> Seu caso está na fila de análise. Um advogado irá avaliar e aceitar seu caso em breve.
              </p>
            )}
            {caso.status === StatusProcesso.EM_ANDAMENTO && (
              <p className="text-sm text-green-800 dark:text-green-200">
                • <strong>Em andamento:</strong> Seu caso está sendo trabalhado pelo advogado. Acompanhe os updates na timeline.
              </p>
            )}
            {caso.status === StatusProcesso.AGUARDANDO_DADOS && (
              <p className="text-sm text-green-800 dark:text-green-200">
                • <strong>Ação necessária:</strong> O advogado solicitou documentos. Acesse a aba &quot;Documentos&quot; e envie os arquivos necessários.
              </p>
            )}
            {caso.status === StatusProcesso.EM_JULGAMENTO && (
              <p className="text-sm text-green-800 dark:text-green-200">
                • <strong>Em julgamento:</strong> Seu caso está em fase de julgamento. Acompanhe os andamentos processuais.
              </p>
            )}
            {caso.status === StatusProcesso.CONCLUIDO && (
              <p className="text-sm text-green-800 dark:text-green-200">
                • <strong>Concluído:</strong> Seu caso foi concluído com sucesso.
              </p>
            )}
            {caso.status === StatusProcesso.ARQUIVADO && (
              <p className="text-sm text-red-800 dark:text-red-200">
                • <strong>Arquivado:</strong> Seu caso foi arquivado. Entre em contato para mais informações.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Seção de Ações Necessárias - específica para advogados */}
      {isAdvogado && (
        <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <h2 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">🎯 Ações Necessárias</h2>
          <div className="space-y-2">
            {(caso as CasoAdvogado).status === StatusProcesso.ACEITO && (
              <p className="text-sm text-blue-800 dark:text-blue-200">
                • <strong>Próximo passo:</strong> Solicite os documentos necessários do cliente ou inicie o desenvolvimento do caso.
              </p>
            )}
            {(caso as CasoAdvogado).status === StatusProcesso.AGUARDANDO_DADOS && (
              <p className="text-sm text-blue-800 dark:text-blue-200">
                • <strong>Aguardando:</strong> Cliente deve enviar os documentos solicitados. Você será notificado quando os documentos forem enviados.
              </p>
            )}
            {(caso as CasoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS && (
              <p className="text-sm text-blue-800 dark:text-blue-200">
                • <strong>Ação requerida:</strong> Analise os documentos enviado(s) pelo cliente. Aprove ou rejeite os documentos.
              </p>
            )}
            {(caso as CasoAdvogado).status === StatusProcesso.EM_ANDAMENTO && (
              <p className="text-sm text-blue-800 dark:text-blue-200">
                • <strong>Em andamento:</strong> Documentos aprovados. Continue com o desenvolvimento do caso e protocole quando estiver pronto.
              </p>
            )}
            {(caso as CasoAdvogado).status === StatusProcesso.PROTOCOLADO && (
              <p className="text-sm text-blue-800 dark:text-blue-200">
                • <strong>Protocolado:</strong> Caso enviado ao fórum competente. Aguarde retorno da análise judicial.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Informações do Caso</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Status:</span> {caso.status}</p>
            <p><span className="font-medium">Data de Solicitação:</span> {new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
            {isAdvogado && (caso as CasoAdvogado).dataAceite && (
              <p><span className="font-medium">Data de Aceite:</span> {new Date((caso as CasoAdvogado).dataAceite).toLocaleDateString('pt-BR')}</p>
            )}
            <p><span className="font-medium">Tipo de Processo:</span> {caso.tipoProcesso}</p>
            <p><span className="font-medium">Urgência:</span> {caso.urgencia}</p>
            <p><span className="font-medium">Descrição:</span> {caso.descricao}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Situação Atual</h2>
          <p className="text-sm text-muted-foreground mb-4">{caso.situacaoAtual}</p>

          <h3 className="font-medium mb-2">Objetivos</h3>
          <p className="text-sm text-muted-foreground mb-4">{caso.objetivos}</p>

          {(caso as CasoCliente).documentosDisponiveis && (
            <>
              <h3 className="font-medium mb-2">Documentos Disponíveis</h3>
              <p className="text-sm text-muted-foreground">{(caso as CasoCliente).documentosDisponiveis}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}