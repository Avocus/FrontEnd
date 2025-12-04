"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  isLegalContext,
  identifyCaseType,
} from "@/lib/legal-ai-config";

export type AnaliseResult = {
  success: boolean;
  message: string;
  processo?: {
    clienteId: number;
    tipoProcesso: string; // ex: CIVIL
    titulo: string;
    descricao: string;
    status: string; // RASCUNHO
    documentosSolicitados?: string[];
  };
};

const LOCAL_STORAGE_KEY = "avocussDraftCase";

function mapCaseTypeToApi(type: string) {
  // Mapeia valores da função identifyCaseType para o formato solicitado
  const map: Record<string, string> = {
    civil: "CIVIL",
    penal: "PENAL",
    trabalhista: "TRABALHISTA",
    tributario: "TRIBUTARIO",
    familia: "FAMILIA",
    constitucional: "CONSTITUCIONAL",
    administrativo: "ADMINISTRATIVO",
    consumidor: "CONSUMIDOR",
  };
  return map[type] || "CIVIL";
}

/**
 * Analisa um payload (formulário/JSON do cliente) para verificar se se trata
 * de um processo jurídico. Se for, corrige/resume o título e descrição e salva
 * um rascunho no localStorage no formato exigido.
 *
 * Entrada: qualquer objeto que contenha texto (ex: titulo, descricao, mensagem)
 */
export async function analiseIAService(payload: Record<string, unknown>): Promise<AnaliseResult> {
  // Normaliza entrada
  const clienteId = typeof payload.clienteId === "number" ? payload.clienteId : 0;
  const rawTitle = (payload.titulo || payload.title || payload.subject || "").toString();
  const rawDescription = (payload.descricao || payload.description || payload.body || payload.text || "").toString();

  const combinedText = `${rawTitle} \n ${rawDescription}`.trim();

  // chave da Gemini (usada quando precisamos pedir recomendações de documentos)
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;

  // Primeiro: verificação heurística local
  if (!combinedText) {
    return {
      success: false,
      message: "Nenhuma informação textual fornecida para análise.",
    };
  }

  // Se heurística local já indica contexto jurídico, não precisamos forçar chamada à API
  const heuristicIsLegal = isLegalContext(combinedText);

  // Função utilitária para construir o JSON final e salvar
  const buildAndSave = (tipoProcesso: string, titulo: string, descricao: string, documentos: string[] = []) => {
    const finalCase = {
      clienteId,
      tipoProcesso: mapCaseTypeToApi(tipoProcesso.toLowerCase()),
      titulo: titulo || rawTitle || descricao.substring(0, 60),
      descricao: descricao || rawDescription || rawTitle,
      status: "RASCUNHO",
      documentosSolicitados: documentos,
    };

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalCase));
      }
    } catch (e) {
      // Não falha a análise apenas por problema no localStorage
      console.warn("Erro ao salvar rascunho no localStorage:", e);
    }

    return finalCase;
  };

  // Se heurística suficiente, cria rascunho imediato
  if (heuristicIsLegal) {
    const inferredType = identifyCaseType(combinedText);
    const cleanedTitle = rawTitle.trim() || combinedText.substring(0, 60);
    const cleanedDescription = rawDescription.trim() || combinedText;

    // Tenta obter recomendações de documentos (se a chave da API estiver disponível)
    let documentos: string[] = [];
    try {
      if (apiKey) {
        const res = await analiseDocumentos(combinedText);
        if (res && res.success && Array.isArray(res.documentos)) documentos = res.documentos;
      }
    } catch (e) {
      console.warn("Falha ao obter recomendações de documentos:", e);
    }

    const finalCase = buildAndSave(inferredType, cleanedTitle, cleanedDescription, documentos);

    return {
      success: true,
      message: "Texto identificado como processo jurídico (heurística local). Rascunho salvo.",
      processo: finalCase,
    };
  }

  // Se não for óbvio, tenta usar Gemini (se disponível) para decisão + correção/resumo
  if (!apiKey) {
    // Sem chave, retorna negativa clara ao usuário
    return {
      success: false,
      message:
        "Não foi possível confirmar que o texto se refere a um processo jurídico (sem chave de IA disponível). Forneça mais detalhes relacionados a direito para prosseguir.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Você é um classificador e reescritor especializado em Direito Brasileiro.
Receba o texto abaixo (título + descrição) e responda estritamente em JSON com as chaves:
  - isLegal: true|false
  - reason: explicação curta (quando false explique o que falta)
  - tipoProcesso: uma das (CIVIL,PENAL,TRABALHISTA,TRIBUTARIO,FAMILIA,CONSTITUCIONAL,ADMINISTRATIVO,CONSUMIDOR) ou null
  - titulo: título corrigido e resumido (máx 80 chars) quando isLegal=true
  - descricao: descrição corrigida, coerente e gramaticamente correta (máx 2000 chars) quando isLegal=true

TEXTO:
"""
${combinedText}
"""

Responda apenas com JSON válido.`;

    const chat = model.startChat({
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    // Extrai JSON do texto (procura por primeiro bloco {...})
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Não veio JSON: fallback negativo
      return {
        success: false,
        message: "A análise automática não retornou uma resposta estruturada. Forneça mais detalhes ou tente novamente.",
      };
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.warn("Falha ao parsear JSON da IA (primeiro parse):", parseErr);
      // Tenta limpar algumas vírgulas comuns ou aspas "tipográficas"
      const cleaned = jsonMatch[0]
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/,\s*\}/g, "}")
        .replace(/,\s*\]/g, "]");
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr2) {
        console.warn("Falha ao parsear JSON da IA (cleaned):", parseErr2);
      }
    }

    // parsed pode não ser object; faz checagem segura
    const parsedObj = (parsed && typeof parsed === 'object') ? parsed as Record<string, unknown> : null;

    if (!parsedObj || typeof parsedObj.isLegal !== "boolean") {
      return {
        success: false,
        message: "Não foi possível interpretar a resposta do analisador de IA.",
      };
    }

    if (!parsedObj.isLegal) {
      const reason = parsedObj.reason ? String(parsedObj.reason) : "Texto não identificado como processo jurídico suficiente para abertura de processo.";
      return {
        success: false,
        message: reason,
      };
    }

    // Extrai campos retornados pela IA
    const tipoProcesso = String(parsedObj.tipoProcesso || identifyCaseType(combinedText) || "civil");
    const titulo = String(parsedObj.titulo || rawTitle || combinedText.substring(0, 60));
    const descricao = String(parsedObj.descricao || rawDescription || combinedText);

    // Após a análise principal, pede também a lista de documentos/evidências
    let documentos: string[] = [];
    try {
      const docRes = await analiseDocumentos(combinedText);
      if (docRes && docRes.success && Array.isArray(docRes.documentos)) documentos = docRes.documentos;
    } catch (e) {
      console.warn("Falha ao analisar documentos:", e);
    }

    const finalCase = buildAndSave(tipoProcesso, titulo, descricao, documentos);

    return {
      success: true,
      message: "Texto identificado como processo jurídico. Rascunho salvo no localStorage.",
      processo: finalCase,
    };
  } catch (error) {
    console.error("Erro na análise por IA:", error);
    return {
      success: false,
      message: "Erro ao comunicar com o serviço de IA. Tente novamente mais tarde.",
    };
  }
}

  /**
   * Analisa um texto/descrição de processo e retorna uma lista recomendada de documentos
   * e evidências que devem ser solicitadas ao cliente. A saída é um objeto com
   * `documentos` (array de strings) quando sucesso.
   */
  export async function analiseDocumentos(text: string): Promise<{ success: boolean; documentos?: string[]; message?: string; raw?: unknown }> {
    const apiKeyLocal = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
    if (!apiKeyLocal) {
      return { success: false, message: "Chave de IA (Gemini) não configurada." };
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKeyLocal);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Você é um assistente jurídico que lista todas as evidências e documentos relevantes para um processo descrito em texto (português - Brasil).
  Retorne estritamente um JSON com a chave "documentos" contendo um array de strings curtas e normalizadas.
  Inclua tanto documentos formais (ex: certidões, contratos, laudos) quanto possíveis evidências eletrônicas e informais (ex: conversas de WhatsApp, e-mails, notas, áudios, vídeos, fotos, postagens, recibos, screenshots).
  Se pertinente, acrescente documentos específicos por tipo de processo (ex: certidão de casamento/união estável para divórcio, boletim de ocorrência para violência, holerites para trabalhista).

  Entrada (contexto do processo):
  """
  ${text}
  """

  Responda apenas com JSON válido, exemplo: {"documentos": ["certidao_casamento","conversas_whatsapp","emails"]}`;

      const chat = model.startChat({ generationConfig: { temperature: 0.12, maxOutputTokens: 400 } });
      const result = await chat.sendMessage(prompt);
      const textResp = result.response.text();

      const jsonMatch = textResp.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return { success: false, message: "Resposta da IA não continha JSON." };

      let parsed: unknown = null;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.warn("analiseDocumentos: parse original falhou:", err);
        const cleaned = jsonMatch[0]
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")
          .replace(/,\s*\}/g, "}")
          .replace(/,\s*\]/g, "]");
        try {
          parsed = JSON.parse(cleaned);
        } catch (e2) {
          console.warn("analiseDocumentos: falha ao parsear JSON da IA", e2);
        }
      }

      if (!parsed || typeof parsed !== "object") return { success: false, message: "Resposta da IA inválida.", raw: parsed };

      const parsedObj = parsed as Record<string, unknown>;
      const documentosRaw = parsedObj.documentos;
      if (!documentosRaw) return { success: false, message: "IA não retornou campo 'documentos'", raw: parsed };

      const documentos: string[] = Array.isArray(documentosRaw) ? documentosRaw.map(String) : [String(documentosRaw)];
      return { success: true, documentos, raw: parsed };
    } catch (error) {
      console.error("Erro em analiseDocumentos:", error);
      return { success: false, message: "Erro ao comunicar com a IA." };
    }
  }

// Exporta também um helper para ler o rascunho salvo
export function getRascunhoSalvo() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Erro ao ler rascunho do localStorage:", e);
  }
  return null;
}

/**
 * Reescreve/ajusta uma dúvida enviada pelo cliente usando Gemini (quando disponível)
 * para ficar mais clara para um advogado. Retorna o texto reformatado ou um
 * fallback se a chave não estiver disponível.
 */
export async function formatDoubt(title: string, text: string): Promise<{ success: boolean; formatted?: string; message?: string; raw?: unknown }> {
  const apiKeyLocal = process.env.NEXT_PUBLIC_API_KEY_GEMINI;

  const combined = `${title || ''}\n\n${text || ''}`.trim();

  if (!combined) {
    return { success: false, message: 'Título e texto vazios.' };
  }

  // Fallback simples quando não há chave: limpa espaço e faz pequenas correções
  if (!apiKeyLocal) {
    const cleaned = combined.replace(/\s+/g, ' ').trim();
    // Tenta criar uma versão curta e objetiva
    const short = cleaned.length > 800 ? `${cleaned.slice(0, 800)}...` : cleaned;
    return { success: true, formatted: short, message: 'Fallback local (sem chave Gemini) usado.' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKeyLocal);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Você é um assistente que reescreve/pergunta formulando claramente uma dúvida jurídica em português (Brasil) para ser enviada a um advogado.
Receba um título e um texto do cliente. Responda apenas com JSON válido com a chave 'formatted' contendo a dúvida final (máx 1000 caracteres) e opcionalmente 'notes' com observações curtas.

Entrada:
TITLE:\n"""
${title}
"""

TEXTO:\n"""
${text}
"""

Saída:`;

    const chat = model.startChat({ generationConfig: { temperature: 0.12, maxOutputTokens: 600 } });
    const result = await chat.sendMessage(prompt);
    const textResp = result.response.text();

    const jsonMatch = textResp.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // se não veio JSON, retorna a resposta bruta como formatted (limpa)
      const fallback = textResp.replace(/\s+/g, ' ').trim();
      return { success: true, formatted: fallback.slice(0, 1000), raw: textResp };
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // tentativa de limpeza simples
      const cleaned = jsonMatch[0].replace(/[“”]/g, '"').replace(/,\s*\}/g, '}');
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.warn('formatDoubt: falha ao parsear JSON da IA', e);
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      const fallback = textResp.replace(/\s+/g, ' ').trim();
      return { success: true, formatted: fallback.slice(0, 1000), raw: textResp };
    }

    const obj = parsed as Record<string, unknown>;
    const formatted = String(obj.formatted || obj.formattedText || obj.rewritten || '');
    if (!formatted) {
      const fallback = textResp.replace(/\s+/g, ' ').trim();
      return { success: true, formatted: fallback.slice(0, 1000), raw: parsed };
    }

    return { success: true, formatted: formatted.slice(0, 2000), raw: parsed };
  } catch (error) {
    console.error('formatDoubt: erro ao chamar Gemini', error);
    return { success: false, message: 'Erro na chamada à IA.' };
  }
}
