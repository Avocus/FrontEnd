"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Serviço de geração automática de petições jurídicas usando IA
 */

export interface DadosPeticao {
  tipoProcesso: string;
  partes: {
    autor: string;
    autorQualificacao: string;
    reu: string;
    reuQualificacao: string;
  };
  fatos: string;
  fundamentacaoJuridica?: string;
  pedidos: string[];
  valorCausa?: number;
  documentos: string[];
  juizo?: string;
  comarca?: string;
}

export interface PeticaoGerada {
  texto: string;
  metadata: {
    tipoProcesso: string;
    dataGeracao: string;
    versao: number;
  };
}

/**
 * Gera uma petição inicial completa baseada nos dados fornecidos
 */
export async function gerarPeticaoInicial(dados: DadosPeticao): Promise<PeticaoGerada> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
  
  if (!apiKey) {
    throw new Error('Chave da API Gemini não configurada');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = construirPromptPeticao(dados);

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.3, // Mais determinístico para documentos formais
      maxOutputTokens: 4000,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const textoPeticao = result.response.text();

    return {
      texto: textoPeticao,
      metadata: {
        tipoProcesso: dados.tipoProcesso,
        dataGeracao: new Date().toISOString(),
        versao: 1,
      },
    };
  } catch (error) {
    console.error('Erro ao gerar petição:', error);
    throw new Error('Falha ao gerar petição. Tente novamente.');
  }
}

/**
 * Constrói o prompt detalhado para geração da petição
 */
function construirPromptPeticao(dados: DadosPeticao): string {
  const pedidosFormatados = dados.pedidos.map((p, i) => `${i + 1}. ${p}`).join('\n');
  const documentosFormatados = dados.documentos.join(', ');

  return `Você é um advogado especializado em ${dados.tipoProcesso} no Brasil.

Gere uma PETIÇÃO INICIAL COMPLETA e PROFISSIONAL seguindo rigorosamente as normas do Código de Processo Civil brasileiro.

DADOS DO PROCESSO:
═══════════════════

JUÍZO: ${dados.juizo || 'MM. Juiz de Direito da [Vara Competente]'}
COMARCA: ${dados.comarca || '[Cidade/UF]'}

PARTES:
━━━━━━
AUTOR: ${dados.partes.autor}
Qualificação: ${dados.partes.autorQualificacao}

RÉU: ${dados.partes.reu}
Qualificação: ${dados.partes.reuQualificacao}

DOS FATOS:
━━━━━━━━━
${dados.fatos}

${dados.fundamentacaoJuridica ? `
FUNDAMENTAÇÃO JURÍDICA:
━━━━━━━━━━━━━━━━━━━━━
${dados.fundamentacaoJuridica}
` : ''}

DOS PEDIDOS:
━━━━━━━━━━
${pedidosFormatados}

VALOR DA CAUSA: ${dados.valorCausa ? `R$ ${dados.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'A ser arbitrado pelo juízo'}

DOCUMENTOS ANEXADOS: ${documentosFormatados}

═══════════════════

INSTRUÇÕES DE FORMATAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━

1. Estruture a petição com:
   - Endereçamento formal ao juízo
   - Qualificação completa das partes
   - Seção "DOS FATOS" (narrativa cronológica e objetiva)
   - Seção "DO DIREITO" (fundamentação jurídica com artigos de lei)
   - Seção "DOS PEDIDOS" (claramente numerados)
   - "DO VALOR DA CAUSA"
   - "DAS PROVAS" (mencionar documentos anexos e outras provas necessárias)
   - Fechamento formal: "Termos em que, Pede deferimento."
   - Data e assinatura

2. Use linguagem:
   - Formal e técnica
   - Gramaticalmente impecável
   - Clara e objetiva
   - Respeitosa ao juízo

3. Cite legislação pertinente (Constituição Federal, Códigos, Leis específicas)

4. Mantenha formatação profissional com títulos em maiúsculas

5. NÃO inclua comentários, apenas o texto da petição

Gere APENAS o texto da petição inicial, sem explicações adicionais.`;
}

/**
 * Gera templates de petição para diferentes tipos de processo
 */
export async function obterTemplatePeticao(tipoProcesso: string): Promise<string> {
  const templates: Record<string, string> = {
    TRABALHISTA: 'Template de Reclamação Trabalhista',
    CIVIL: 'Template de Ação Civil',
    FAMILIA: 'Template de Ação de Família',
    CONSUMIDOR: 'Template de Ação de Defesa do Consumidor',
    PREVIDENCIARIO: 'Template de Ação Previdenciária',
    CRIMINAL: 'Template de Denúncia/Queixa-Crime',
  };

  return templates[tipoProcesso] || templates.CIVIL;
}

/**
 * Valida os dados antes de enviar para IA
 */
export function validarDadosPeticao(dados: DadosPeticao): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  if (!dados.partes.autor.trim()) {
    erros.push('Nome do autor é obrigatório');
  }

  if (!dados.partes.reu.trim()) {
    erros.push('Nome do réu é obrigatório');
  }

  if (!dados.fatos.trim() || dados.fatos.length < 50) {
    erros.push('Descrição dos fatos deve ter pelo menos 50 caracteres');
  }

  if (!dados.pedidos.length) {
    erros.push('Pelo menos um pedido deve ser informado');
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

/**
 * Salva petição gerada no localStorage para recuperação posterior
 */
export function salvarPeticaoRascunho(peticao: PeticaoGerada): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const key = `peticao_rascunho_${Date.now()}`;
      window.localStorage.setItem(key, JSON.stringify(peticao));
    }
  } catch (error) {
    console.warn('Erro ao salvar rascunho:', error);
  }
}

/**
 * Exporta petição como texto formatado para cópia
 */
export function exportarPeticaoTexto(peticao: PeticaoGerada): string {
  const dataGeracao = new Date(peticao.metadata.dataGeracao).toLocaleString('pt-BR');
  
  return `${peticao.texto}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Documento gerado por IA - Revisão obrigatória
Tipo: ${peticao.metadata.tipoProcesso}
Data: ${dataGeracao}
Sistema: AVOCUSS v${peticao.metadata.versao}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}
