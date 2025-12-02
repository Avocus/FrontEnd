"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Serviço de resumo automático de documentos jurídicos usando IA
 */

export interface ResumoDocumento {
  resumoExecutivo: string;
  pontosChave: string[];
  acoesNecessarias: string[];
  prazosIdentificados: Array<{
    descricao: string;
    data?: string;
    dias?: number;
    urgente: boolean;
  }>;
  partesEnvolvidas: string[];
  valorCausa?: number;
  tipoDocumento?: string;
  observacoes?: string[];
}

/**
 * Resume um documento jurídico extraindo informações importantes
 */
export async function resumirDocumento(textoDocumento: string, contexto?: string): Promise<ResumoDocumento> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
  
  if (!apiKey) {
    throw new Error('Chave da API Gemini não configurada');
  }

  if (!textoDocumento || textoDocumento.trim().length < 100) {
    throw new Error('Documento muito curto para análise (mínimo 100 caracteres)');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Limitar tamanho do documento (Gemini suporta ~30k tokens, ~120k caracteres)
  const textoLimitado = textoDocumento.slice(0, 50000);
  const prompt = construirPromptResumo(textoLimitado, contexto);

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2000,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const texto = result.response.text();

    // Extrair JSON da resposta
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido');
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      const cleaned = jsonMatch[0]
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/,\s*\}/g, "}")
        .replace(/,\s*\]/g, "]");
      parsed = JSON.parse(cleaned);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Falha ao parsear resposta da IA');
    }

    return parsed as ResumoDocumento;
  } catch (error) {
    console.error('Erro ao resumir documento:', error);
    throw new Error('Falha ao resumir documento. Tente novamente.');
  }
}

/**
 * Constrói o prompt para resumo de documento
 */
function construirPromptResumo(texto: string, contexto?: string): string {
  return `Você é um assistente jurídico especializado em análise de documentos.

Analise o documento jurídico abaixo e extraia as informações mais importantes.

${contexto ? `
CONTEXTO: ${contexto}
` : ''}

DOCUMENTO:
═══════════════════
${texto}
═══════════════════

INSTRUÇÕES:
━━━━━━━━━━

Forneça um resumo estruturado contendo:

1. **Resumo Executivo**: Síntese clara e objetiva do documento (máx 300 palavras)
2. **Pontos-Chave**: Lista dos pontos mais importantes
3. **Ações Necessárias**: O que precisa ser feito baseado no documento
4. **Prazos**: Identifique TODOS os prazos mencionados
5. **Partes Envolvidas**: Liste pessoas/empresas mencionadas
6. **Valor da Causa**: Se houver valor monetário mencionado por mês ou total
7. **Tipo de Documento**: Classifique o documento (petição, sentença, contrato, etc)
8. **Observações**: Pontos de atenção especiais

Responda ESTRITAMENTE em JSON:

{
  "resumoExecutivo": "texto do resumo",
  "pontosChave": ["ponto 1", "ponto 2", ...],
  "acoesNecessarias": ["ação 1", "ação 2", ...],
  "prazosIdentificados": [
    {
      "descricao": "descrição do prazo",
      "data": "YYYY-MM-DD ou null",
      "dias": número de dias ou null,
      "urgente": true/false
    }
  ],
  "partesEnvolvidas": ["parte 1", "parte 2", ...],
  "valorCausa": número ou null,
  "tipoDocumento": "tipo do documento",
  "observacoes": ["observação 1", "observação 2", ...]
}

IMPORTANTE:
- Seja preciso e objetivo
- Não invente informações não presentes no documento
- Destaque prazos urgentes (menos de 15 dias)
- Use formatação clara

Responda APENAS com o JSON, sem texto adicional.`;
}

/**
 * Extrai texto de arquivo (simulação - em produção usar biblioteca específica)
 */
export async function extrairTextoArquivo(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const texto = e.target?.result as string;
      if (!texto) {
        reject(new Error('Falha ao ler arquivo'));
        return;
      }
      resolve(texto);
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    // Para PDFs, seria necessário usar pdf.js ou similar
    // Para DOCX, usar mammoth.js ou similar
    // Por enquanto, apenas texto puro
    if (arquivo.type === 'text/plain') {
      reader.readAsText(arquivo);
    } else {
      reject(new Error('Tipo de arquivo não suportado. Use .txt por enquanto.'));
    }
  });
}

/**
 * Formata o resumo para exibição ou exportação
 */
export function formatarResumoTexto(resumo: ResumoDocumento): string {
  const prazosFormatados = resumo.prazosIdentificados
    .map((p, i) => {
      const urgencia = p.urgente ? '🔴 URGENTE' : '';
      const dataInfo = p.data ? `Data: ${new Date(p.data).toLocaleDateString('pt-BR')}` : 
                       p.dias ? `Prazo: ${p.dias} dias` : '';
      return `${i + 1}. ${p.descricao} ${dataInfo} ${urgencia}`;
    })
    .join('\n');

  return `
═══════════════════════════════════════════════════
        RESUMO DE DOCUMENTO JURÍDICO
═══════════════════════════════════════════════════

Tipo: ${resumo.tipoDocumento || 'Não identificado'}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RESUMO EXECUTIVO:
${resumo.resumoExecutivo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 PONTOS-CHAVE:
${resumo.pontosChave.map((p, i) => `${i + 1}. ${p}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ AÇÕES NECESSÁRIAS:
${resumo.acoesNecessarias.map((a, i) => `${i + 1}. ${a}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ PRAZOS IDENTIFICADOS:
${prazosFormatados || 'Nenhum prazo identificado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 PARTES ENVOLVIDAS:
${resumo.partesEnvolvidas.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${resumo.valorCausa ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 VALOR DA CAUSA:
R$ ${resumo.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
` : ''}

${resumo.observacoes && resumo.observacoes.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ OBSERVAÇÕES IMPORTANTES:
${resumo.observacoes.map((o, i) => `${i + 1}. ${o}`).join('\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ AVISO:
Este resumo foi gerado por IA e deve ser revisado por um 
profissional. Não substitui a leitura completa do documento.

Sistema: AVOCUSS | Gerado por IA com Google Gemini
═══════════════════════════════════════════════════
`;
}

/**
 * Identifica prazos urgentes (menos de 15 dias)
 */
export function obterPrazosUrgentes(resumo: ResumoDocumento): ResumoDocumento['prazosIdentificados'] {
  return resumo.prazosIdentificados.filter(p => p.urgente || (p.dias && p.dias <= 15));
}

/**
 * Salva resumo no histórico local
 */
export function salvarResumoHistorico(resumo: ResumoDocumento, nomeArquivo: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const historico = obterHistoricoResumos();
      historico.push({
        resumo,
        nomeArquivo,
        data: new Date().toISOString(),
      });
      
      // Manter apenas últimos 20 resumos
      const historicoLimitado = historico.slice(-20);
      window.localStorage.setItem('historico_resumos', JSON.stringify(historicoLimitado));
    }
  } catch (error) {
    console.warn('Erro ao salvar histórico:', error);
  }
}

/**
 * Obtém histórico de resumos
 */
export function obterHistoricoResumos(): Array<{ resumo: ResumoDocumento; nomeArquivo: string; data: string }> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('historico_resumos');
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (error) {
    console.warn('Erro ao ler histórico:', error);
  }
  return [];
}

/**
 * Valida tamanho do documento antes de enviar
 */
export function validarTamanhoDocumento(texto: string): { valido: boolean; erro?: string } {
  if (!texto || texto.trim().length === 0) {
    return { valido: false, erro: 'Documento vazio' };
  }
  
  if (texto.length < 100) {
    return { valido: false, erro: 'Documento muito curto (mínimo 100 caracteres)' };
  }
  
  if (texto.length > 100000) {
    return { valido: false, erro: 'Documento muito grande (máximo 100.000 caracteres)' };
  }
  
  return { valido: true };
}
