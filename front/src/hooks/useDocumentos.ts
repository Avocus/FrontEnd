import { useState } from "react";
import { ProcessoCliente, ProcessoAdvogado, DocumentoAnexado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import { useProcessoStore } from "@/store";
import { useToast } from "@/hooks/useToast";
import { fileToBase64, addTimelineEntry } from "@/utils/processoUtils";

interface UseDocumentosProps {
  processoId: string;
  processo: ProcessoCliente | ProcessoAdvogado | null;
  isAdvogado: boolean;
}

export function useDocumentos({ processoId, processo, isAdvogado }: UseDocumentosProps) {
  const { atualizarProcessoCliente, atualizarProcessoAdvogado } = useProcessoStore();
  const { success: showSuccess, error: showError } = useToast();

  const [documentosParaEnvio, setDocumentosParaEnvio] = useState<File[]>([]);
  const [enviandoDocumentos, setEnviandoDocumentos] = useState(false);

  // Função para adicionar arquivos
  const adicionarArquivos = (files: FileList | null) => {
    if (!files) return;

    const novosArquivos = Array.from(files).filter(file => {
      // Verificar se já não existe um arquivo com o mesmo nome
      return !documentosParaEnvio.some(doc => doc.name === file.name);
    });

    setDocumentosParaEnvio(prev => [...prev, ...novosArquivos]);
  };

  // Função para remover arquivo da lista de envio
  const removerArquivo = (index: number) => {
    setDocumentosParaEnvio(prev => prev.filter((_, i) => i !== index));
  };

  // Função para remover documento já enviado
  const removerDocumentoEnviado = async (documentoId: string) => {
    try {
      if (isAdvogado) {
        // Para advogados, atualizar processoAdvogado
        const processoAtual = processo as ProcessoAdvogado;
        if (!processoAtual) return;

        const documentosAtualizados = (processoAtual.documentosAnexados || []).filter(doc => doc.id !== documentoId);
        atualizarProcessoAdvogado(processoId, {
          documentosAnexados: documentosAtualizados
        });
      } else {
        // Para clientes, atualizar processoCliente
        const processoAtual = processo as ProcessoCliente;
        if (!processoAtual) return;

        const documentosAtualizados = (processoAtual.documentosAnexados || []).filter(doc => doc.id !== documentoId);
        atualizarProcessoCliente(processoId, {
          documentosAnexados: documentosAtualizados
        });
      }

      showSuccess("Documento removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover documento:", error);
      showError("Erro ao remover documento. Tente novamente.");
    }
  };

  // Função para enviar todos os documentos
  const enviarTodosDocumentos = async () => {
    if (documentosParaEnvio.length === 0) {
      showError("Selecione ao menos um documento para enviar");
      return;
    }

    if (!processo) {
      showError("Processo não encontrado");
      return;
    }

    setEnviandoDocumentos(true);

    try {
      // Converter todos os arquivos para base64
      const documentosConvertidos: DocumentoAnexado[] = await Promise.all(
        documentosParaEnvio.map(async (file, index) => {
          const conteudoBase64 = await fileToBase64(file);
          return {
            id: `doc-${Date.now()}-${index}`,
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            dataEnvio: new Date().toISOString(),
            conteudo: conteudoBase64
          };
        })
      );

      if (isAdvogado) {
        // Para advogados, atualizar processoAdvogado
        atualizarProcessoAdvogado(processoId, {
          documentosAnexados: [...(processo.documentosAnexados || []), ...documentosConvertidos]
        });
      } else {
        // Para clientes, atualizar processoCliente
        const timelineEntry = addTimelineEntry(
          processo.status,
          StatusProcesso.EM_ANDAMENTO,
          `Cliente enviou ${documentosParaEnvio.length} documento(s) para análise`,
          "cliente",
          `Documentos: ${documentosParaEnvio.map(f => f.name).join(", ")}`
        );

        atualizarProcessoCliente(processoId, {
          status: StatusProcesso.EM_ANDAMENTO,
          documentosAnexados: [...(processo.documentosAnexados || []), ...documentosConvertidos],
          timeline: [...(processo.timeline || []), timelineEntry]
        });

        // Também atualizar o processo no store dos advogados (se existir)
        // Como não temos acesso direto ao store dos advogados aqui, vamos usar um evento
        window.dispatchEvent(new CustomEvent("processoClienteUpdated", {
          detail: {
            processoId,
            updates: {
              status: "aguardando_analise_documentos",
              documentosAnexados: documentosConvertidos,
              timeline: timelineEntry
            }
          }
        }));
      }

      showSuccess(`${documentosParaEnvio.length} documento(s) enviado(s) com sucesso!`);
      setDocumentosParaEnvio([]);

    } catch (error) {
      console.error("Erro ao enviar documentos:", error);
      showError("Erro ao enviar documentos. Tente novamente.");
    } finally {
      setEnviandoDocumentos(false);
    }
  };

  return {
    documentosParaEnvio,
    enviandoDocumentos,
    adicionarArquivos,
    removerArquivo,
    removerDocumentoEnviado,
    enviarTodosDocumentos,
    setDocumentosParaEnvio
  };
}