"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Serviço de integração com Google Gemini AI
 * Usado para sugerir documentos necessários baseado no contexto do processo
 */

interface DocumentosSugeridos {
  documentos: string[];
}

interface SugerirDocumentosRequest {
  titulo: string;
  descricao: string;
  tipoProcesso: string;
  situacaoAtual: string;
  objetivos: string;
}

/**
 * Consulta o Gemini AI para sugerir documentos relevantes para um processo
 */
export const sugerirDocumentosIA = async (
  contexto: SugerirDocumentosRequest
): Promise<string[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
    
    if (!apiKey) {
      console.warn('NEXT_PUBLIC_API_KEY_GEMINI não configurada, retornando documentos padrão');
      return obterDocumentosPadrao(contexto.tipoProcesso);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Você é um assistente jurídico que lista todas as evidências e documentos relevantes para um processo descrito em texto (português - Brasil).
  Retorne estritamente um JSON com a chave "documentos" contendo um array de strings curtas e normalizadas.
  Inclua tanto documentos formais (ex: certidões, contratos, laudos) quanto possíveis evidências eletrônicas e informais (ex: conversas de WhatsApp, e-mails, notas, áudios, vídeos, fotos, postagens, recibos, screenshots).
  Se pertinente, acrescente documentos específicos por tipo de processo (ex: certidão de casamento/união estável para divórcio, boletim de ocorrência para violência, holerites para trabalhista).

  Entrada (contexto do processo):
  """
  Título: ${contexto.titulo}
  Tipo: ${contexto.tipoProcesso}
  Descrição: ${contexto.descricao}
  Situação Atual: ${contexto.situacaoAtual}
  Objetivos: ${contexto.objetivos}
  """

  Responda apenas com JSON válido, exemplo: {"documentos": ["certidao_casamento","conversas_whatsapp","emails"]}`;

    const chat = model.startChat({ 
      generationConfig: { 
        temperature: 0.12, 
        maxOutputTokens: 400 
      } 
    });
    
    const result = await chat.sendMessage(prompt);
    const texto = result.response.text();
    
    if (!texto) {
      console.warn('Resposta vazia do Gemini, usando documentos padrão');
      return obterDocumentosPadrao(contexto.tipoProcesso);
    }

    // Tentar parsear o JSON da resposta
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Resposta não contém JSON, usando documentos padrão');
      return obterDocumentosPadrao(contexto.tipoProcesso);
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.warn("Parse original falhou, tentando limpeza:", err);
      const cleaned = jsonMatch[0]
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/,\s*\}/g, "}")
        .replace(/,\s*\]/g, "]");
      try {
        parsed = JSON.parse(cleaned);
      } catch (e2) {
        console.warn("Falha ao parsear JSON da IA após limpeza", e2);
        return obterDocumentosPadrao(contexto.tipoProcesso);
      }
    }

    if (!parsed || typeof parsed !== "object") {
      return obterDocumentosPadrao(contexto.tipoProcesso);
    }

    const resultado = parsed as DocumentosSugeridos;
    if (Array.isArray(resultado.documentos) && resultado.documentos.length > 0) {
      return resultado.documentos.map(doc => formatarNomeDocumento(doc));
    }

    // Fallback para documentos padrão
    return obterDocumentosPadrao(contexto.tipoProcesso);
  } catch (error) {
    console.error('Erro ao consultar Gemini AI:', error);
    // Retornar documentos padrão em caso de erro
    return obterDocumentosPadrao(contexto.tipoProcesso);
  }
};

/**
 * Formata o nome do documento de snake_case para título legível
 */
function formatarNomeDocumento(doc: string): string {
  return doc
    .split('_')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Retorna uma lista de documentos padrão baseado no tipo de processo
 */
function obterDocumentosPadrao(tipoProcesso: string): string[] {
  const documentosPorTipo: Record<string, string[]> = {
    TRABALHISTA: [
      'Carteira de Trabalho',
      'Holerites',
      'Contrato de Trabalho',
      'Comprovante de Rescisão',
      'E-mails Corporativos',
      'Conversas WhatsApp',
    ],
    CIVIL: [
      'Documentos Pessoais',
      'Contratos',
      'Comprovantes',
      'E-mails',
      'Fotos',
      'Vídeos',
    ],
    FAMILIA: [
      'Certidão de Casamento',
      'Certidão de Nascimento',
      'Documentos Pessoais',
      'Comprovantes de Renda',
      'Comprovante de Residência',
      'Fotos',
    ],
    CONSUMIDOR: [
      'Nota Fiscal',
      'Contrato de Compra',
      'Protocolo de Atendimento',
      'E-mails',
      'Conversas WhatsApp',
      'Fotos do Produto',
      'Recibo',
    ],
    PREVIDENCIARIO: [
      'Documentos Pessoais',
      'Carteira de Trabalho',
      'Carnê de Contribuição',
      'Laudos Médicos',
      'Exames',
      'Atestados',
    ],
    TRIBUTARIO: [
      'Declarações de Imposto',
      'Comprovantes de Pagamento',
      'Contratos',
      'Notas Fiscais',
      'Extratos Bancários',
      'Documentos da Empresa',
    ],
    CRIMINAL: [
      'Boletim de Ocorrência',
      'Documentos Pessoais',
      'Testemunhas',
      'Fotos',
      'Vídeos',
      'Laudos',
      'Atestados Médicos',
    ],
  };

  return documentosPorTipo[tipoProcesso] || [
    'Documentos Pessoais',
    'Contratos',
    'Comprovantes',
    'E-mails',
    'Fotos',
  ];
}
