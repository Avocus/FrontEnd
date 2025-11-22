import { useState } from "react";
import { CasoCliente, CasoAdvogado, DocumentoAnexado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import { useCasoStore } from "@/store";
import { useToast } from "@/hooks/useToast";
import { fileToBase64, addTimelineEntry } from "@/utils/casoUtils";

interface UseDocumentosProps {
  casoId: string;
  caso: CasoCliente | CasoAdvogado | null;
  isAdvogado: boolean;
}

export function useDocumentos({ casoId, caso, isAdvogado }: UseDocumentosProps) {
  const { atualizarCasoCliente, atualizarCasoAdvogado } = useCasoStore();
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
        // Para advogados, atualizar casoAdvogado
        const casoAtual = caso as CasoAdvogado;
        if (!casoAtual) return;

        const documentosAtualizados = (casoAtual.documentosAnexados || []).filter(doc => doc.id !== documentoId);
        atualizarCasoAdvogado(casoId, {
          documentosAnexados: documentosAtualizados
        });
      } else {
        // Para clientes, atualizar casoCliente
        const casoAtual = caso as CasoCliente;
        if (!casoAtual) return;

        const documentosAtualizados = (casoAtual.documentosAnexados || []).filter(doc => doc.id !== documentoId);
        atualizarCasoCliente(casoId, {
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

    if (!caso) {
      showError("Caso não encontrado");
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
        // Para advogados, atualizar casoAdvogado
        atualizarCasoAdvogado(casoId, {
          documentosAnexados: [...(caso.documentosAnexados || []), ...documentosConvertidos]
        });
      } else {
        // Para clientes, atualizar casoCliente
        const timelineEntry = addTimelineEntry(
          caso.status,
          StatusProcesso.EM_ANDAMENTO,
          `Cliente enviou ${documentosParaEnvio.length} documento(s) para análise`,
          "cliente",
          `Documentos: ${documentosParaEnvio.map(f => f.name).join(", ")}`
        );

        atualizarCasoCliente(casoId, {
          status: StatusProcesso.EM_ANDAMENTO,
          documentosAnexados: [...(caso.documentosAnexados || []), ...documentosConvertidos],
          timeline: [...(caso.timeline || []), timelineEntry]
        });

        // Também atualizar o caso no store dos advogados (se existir)
        // Como não temos acesso direto ao store dos advogados aqui, vamos usar um evento
        window.dispatchEvent(new CustomEvent("casoClienteUpdated", {
          detail: {
            casoId,
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