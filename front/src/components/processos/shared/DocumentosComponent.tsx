import { useState } from "react";
import { ProcessoCliente, ProcessoAdvogado, DocumentoAnexado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, Send } from "lucide-react";
import { useDocumentos } from "@/hooks/useDocumentos";
import { podeModificarDocumentos, podeGerenciarDocumentos } from "@/utils/processoUtils";

interface DocumentosComponentProps {
  processo: ProcessoCliente | ProcessoAdvogado;
  processoId: string;
  isAdvogado: boolean;
}

export function DocumentosComponent({ processo, processoId, isAdvogado }: DocumentosComponentProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const {
    documentosParaEnvio,
    enviandoDocumentos,
    adicionarArquivos,
    removerArquivo,
    removerDocumentoEnviado,
    enviarTodosDocumentos,
    setDocumentosParaEnvio
  } = useDocumentos({ processoId, processo, isAdvogado });

  return (
    <div className="space-y-4">
      {/* Aviso quando documentos estão em análise - apenas para clientes */}
      {!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
              <span className="text-amber-600 dark:text-amber-400 text-sm">⏳</span>
            </div>
            <div>
              <h3 className="font-medium text-amber-900 dark:text-amber-100">Documentos em Análise</h3>
              <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                Seus documentos estão sendo analisados pelo advogado. Durante este período, não é possível adicionar ou remover documentos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aviso quando documentos estão em análise - para advogados */}
      {isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm">📋</span>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Documentos Aguardando Análise</h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                O cliente enviou documentos que precisam da sua análise. Revise e aprove ou rejeite os documentos.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Documentos do Processo</h2>
          {podeGerenciarDocumentos(processo.status, isAdvogado) && (
            <Button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2"
              disabled={!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO}
              variant={!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO ? "outline" : "default"}
            >
              <Upload className="h-4 w-4" />
              {!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO
                ? "Documentos em Análise"
                : "Enviar Documentos"
              }
            </Button>
          )}
        </div>

        {/* Documentos solicitados - apenas para clientes */}
        {!isAdvogado && (processo as ProcessoCliente).documentosDisponiveis && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Documentos Solicitados:</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{(processo as ProcessoCliente).documentosDisponiveis}</p>
            </div>
          </div>
        )}

        {/* Documentos enviados */}
        {processo.documentosAnexados && processo.documentosAnexados.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">
                {isAdvogado ? "Documentos Enviados pelo Cliente" : "Documentos Enviados"} ({processo.documentosAnexados.length})
              </h3>
              <Badge variant={
                isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS ? "default" :
                !isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO ? "secondary" : "secondary"
              } className="text-xs">
                {!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO ? "Em análise" :
                 isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS ? "Pendente Análise" : "Processado"}
              </Badge>
            </div>
            <div className="grid gap-3">
              {processo.documentosAnexados.map((doc, index) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{doc.nome}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{doc.tipo || 'Tipo desconhecido'}</span>
                        <span>•</span>
                        <span>{(doc.tamanho / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>
                          {new Date(doc.dataEnvio).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Criar link para download
                        const link = document.createElement('a');
                        link.href = doc.conteudo;
                        link.download = doc.nome;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="h-8 px-2"
                    >
                      <span className="text-xs">Baixar</span>
                    </Button>
                    {podeModificarDocumentos(processo.status, isAdvogado) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja remover o documento "${doc.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
                            removerDocumentoEnviado(doc.id);
                          }
                        }}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Remover documento"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {!podeModificarDocumentos(processo.status, isAdvogado) && !isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO && (
                      <Badge variant="secondary" className="text-xs">
                        Em análise
                      </Badge>
                    )}
                    <Badge
                      variant={!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO ? "default" : "outline"}
                      className="text-xs"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo dos documentos */}
            <div className={`mt-4 p-3 rounded-lg border ${
              !isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                : isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS
                ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <FileText className={`h-4 w-4 ${
                  !isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO
                    ? "text-amber-600"
                    : isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS
                    ? "text-blue-600"
                    : "text-green-600"
                }`} />
                <span className={`font-medium ${
                  !isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO
                    ? "text-amber-900 dark:text-amber-100"
                    : isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS
                    ? "text-blue-900 dark:text-blue-100"
                    : "text-green-900 dark:text-green-100"
                }`}>
                  Total: {processo.documentosAnexados.length} documento(s) {isAdvogado ? "recebido(s)" : "enviado(s)"}
                </span>
              </div>
              <p className={`text-xs mt-1 ${
                !isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO
                  ? "text-amber-700 dark:text-amber-200"
                  : isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS
                  ? "text-blue-700 dark:text-blue-200"
                  : "text-green-700 dark:text-green-200"
              }`}>
                {!isAdvogado && processo.status === StatusProcesso.EM_ANDAMENTO
                  ? "📋 Documentos em análise pelo advogado responsável. Modificações bloqueadas temporariamente."
                  : isAdvogado && (processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_ANALISE_DADOS
                  ? "⏳ Aguardando sua análise. Aprove ou rejeite os documentos usando os botões acima."
                  : "✅ Documentos analisados e processados"
                }
              </p>
            </div>
          </div>
        )}

        {(!processo.documentosAnexados || processo.documentosAnexados.length === 0) && (
          <p className="text-muted-foreground text-center py-8">
            {isAdvogado
              ? ((processo as ProcessoAdvogado).status === StatusProcesso.AGUARDANDO_DADOS
                  ? "Aguardando envio de documentos pelo cliente."
                  : "Nenhum documento foi enviado pelo cliente ainda.")
              : "Nenhum documento informado para este processo."
            }
          </p>
        )}
      </div>

      {/* Modal para envio de documentos */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAdvogado ? "Gerenciar Documentos" :
                processo.status === StatusProcesso.EM_ANDAMENTO
                ? "Documentos em Análise"
                : "Enviar Documentos"
              }
            </DialogTitle>
            <DialogDescription>
              {isAdvogado ? "Gerencie os documentos deste processo." :
                processo.status === StatusProcesso.EM_ANDAMENTO
                ? "Os documentos enviados estão sendo analisados pelo advogado. Você não pode modificar documentos neste momento."
                : "Selecione os documentos que deseja enviar para este processo. Todos os documentos serão anexados ao processo."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Input para seleção de arquivos */}
            {podeModificarDocumentos(processo.status, isAdvogado) ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => adicionarArquivos(e.target.files)}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Clique para selecionar arquivos</p>
                  <p className="text-xs text-muted-foreground">
                    Suporte a PDF, DOC, DOCX, JPG, PNG, TXT
                  </p>
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg p-6 text-center opacity-50">
                <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium mb-1 text-gray-500">
                  {isAdvogado ? "Gerenciamento bloqueado" : "Envio de documentos bloqueado"}
                </p>
                <p className="text-xs text-gray-400">
                  {isAdvogado ? "Função não disponível para advogados aqui" : "Os documentos estão sendo analisados pelo advogado"}
                </p>
              </div>
            )}

            {/* Lista de arquivos selecionados */}
            {documentosParaEnvio.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Arquivos Selecionados ({documentosParaEnvio.length})</h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {documentosParaEnvio.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerArquivo(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentos solicitados (referência) - apenas para clientes */}
            {!isAdvogado && (processo as ProcessoCliente).documentosDisponiveis && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-1">Documentos Solicitados:</h4>
                <p className="text-xs text-muted-foreground">{(processo as ProcessoCliente).documentosDisponiveis}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setModalAberto(false);
                setDocumentosParaEnvio([]);
              }}
            >
              {isAdvogado ? "Fechar" :
                processo.status === StatusProcesso.EM_ANDAMENTO ? "Fechar" : "Cancelar"}
            </Button>
            {podeModificarDocumentos(processo.status, isAdvogado) && (
              <Button
                onClick={enviarTodosDocumentos}
                disabled={documentosParaEnvio.length === 0 || enviandoDocumentos}
                className="flex items-center gap-2"
              >
                {enviandoDocumentos ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar {documentosParaEnvio.length > 0 ? `${documentosParaEnvio.length} documento(s)` : 'Documentos'}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}