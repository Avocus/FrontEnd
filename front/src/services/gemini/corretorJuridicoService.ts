"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Serviço de correção automática de textos jurídicos usando IA
 */

export type TipoCorrecao = 'GRAMATICA' | 'TERMO_JURIDICO' | 'CLAREZA' | 'FORMATACAO' | 'ESTILO';

export interface Correcao {
  tipo: TipoCorrecao;
  original: string;
  corrigido: string;
  explicacao: string;
  posicao: {
    inicio: number;
    fim: number;
  };
  gravidade: 'CRITICA' | 'IMPORTANTE' | 'SUGESTAO';
}

export interface CorrecaoTexto {
  textoOriginal: string;
  textoCorrigido: string;
  correcoes: Correcao[];
  sugestoes: string[];
  melhorias: string[];
  score: {
    original: number; // 0-100
    corrigido: number; // 0-100
  };
}

/**
 * Corrige e melhora um texto jurídico
 */
export async function corrigirTextoJuridico(texto: string, tipoDocumento?: string): Promise<CorrecaoTexto> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
  
  if (!apiKey) {
    throw new Error('Chave da API Gemini não configurada');
  }

  if (!texto || texto.trim().length < 10) {
    throw new Error('Texto muito curto para análise (mínimo 10 caracteres)');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = construirPromptCorrecao(texto, tipoDocumento);

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 3000,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const resposta = result.response.text();

    // Extrair JSON da resposta
    const jsonMatch = resposta.match(/\{[\s\S]*\}/);
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

    return parsed as CorrecaoTexto;
  } catch (error) {
    console.error('Erro ao corrigir texto:', error);
    throw new Error('Falha ao corrigir texto. Tente novamente.');
  }
}

/**
 * Constrói o prompt para correção de texto
 */
function construirPromptCorrecao(texto: string, tipoDocumento?: string): string {
  return `Você é um revisor especializado em textos jurídicos brasileiros.

Analise e corrija o texto abaixo para adequá-lo aos padrões da linguagem jurídica formal.

${tipoDocumento ? `TIPO DE DOCUMENTO: ${tipoDocumento}` : ''}

TEXTO ORIGINAL:
═══════════════════
${texto}
═══════════════════

INSTRUÇÕES DE CORREÇÃO:
━━━━━━━━━━━━━━━━━━━━

Corrija e melhore considerando:

1. **Gramática e Ortografia:**
   - Erros de concordância
   - Pontuação incorreta
   - Ortografia

2. **Terminologia Jurídica:**
   - Uso correto de termos técnicos
   - Expressões latinas adequadas
   - Nomenclatura de institutos jurídicos

3. **Clareza e Objetividade:**
   - Frases longas e confusas
   - Ambiguidades
   - Linguagem rebuscada desnecessária

4. **Formatação e Estilo:**
   - Estrutura de parágrafos
   - Uso de maiúsculas/minúsculas
   - Marcadores e numeração

5. **Linguagem Formal:**
   - Nível de formalidade adequado
   - Evitar coloquialismos
   - Tom respeitoso e profissional

Responda ESTRITAMENTE em JSON:

{
  "textoOriginal": "texto fornecido",
  "textoCorrigido": "texto após todas as correções",
  "correcoes": [
    {
      "tipo": "GRAMATICA" | "TERMO_JURIDICO" | "CLAREZA" | "FORMATACAO" | "ESTILO",
      "original": "trecho original",
      "corrigido": "trecho corrigido",
      "explicacao": "explicação da correção",
      "posicao": { "inicio": número, "fim": número },
      "gravidade": "CRITICA" | "IMPORTANTE" | "SUGESTAO"
    }
  ],
  "sugestoes": [
    "sugestão geral 1",
    "sugestão geral 2"
  ],
  "melhorias": [
    "ponto que foi melhorado 1",
    "ponto que foi melhorado 2"
  ],
  "score": {
    "original": número de 0-100,
    "corrigido": número de 0-100
  }
}

IMPORTANTE:
- Mantenha o sentido original do texto
- Não invente informações
- Liste TODAS as correções feitas
- Explique CADA correção de forma didática
- Score deve refletir qualidade objetiva

Responda APENAS com o JSON, sem texto adicional.`;
}

/**
 * Aplica correções específicas ao texto
 */
export function aplicarCorrecoes(texto: string, correcoes: Correcao[]): string {
  let textoCorrigido = texto;
  
  // Ordenar correções do fim para o início para não afetar posições
  const correcoesOrdenadas = [...correcoes].sort((a, b) => b.posicao.inicio - a.posicao.inicio);
  
  for (const correcao of correcoesOrdenadas) {
    textoCorrigido = 
      textoCorrigido.slice(0, correcao.posicao.inicio) +
      correcao.corrigido +
      textoCorrigido.slice(correcao.posicao.fim);
  }
  
  return textoCorrigido;
}

/**
 * Filtra correções por tipo
 */
export function filtrarCorrecoesPorTipo(correcoes: Correcao[], tipos: TipoCorrecao[]): Correcao[] {
  return correcoes.filter(c => tipos.includes(c.tipo));
}

/**
 * Filtra correções por gravidade
 */
export function filtrarCorrecoesPorGravidade(correcoes: Correcao[], gravidade: Correcao['gravidade'][]): Correcao[] {
  return correcoes.filter(c => gravidade.includes(c.gravidade));
}

/**
 * Gera relatório de correções
 */
export function gerarRelatorioCorrecoes(resultado: CorrecaoTexto): string {
  const correcoesCriticas = resultado.correcoes.filter(c => c.gravidade === 'CRITICA').length;
  const correcoesImportantes = resultado.correcoes.filter(c => c.gravidade === 'IMPORTANTE').length;
  const sugestoes = resultado.correcoes.filter(c => c.gravidade === 'SUGESTAO').length;

  const melhoria = resultado.score.corrigido - resultado.score.original;
  const percentualMelhoria = ((melhoria / resultado.score.original) * 100).toFixed(1);

  return `
═══════════════════════════════════════════════════
      RELATÓRIO DE CORREÇÃO DE TEXTO JURÍDICO
═══════════════════════════════════════════════════

Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ANÁLISE DE QUALIDADE:

Score Original:  ${resultado.score.original}/100
Score Corrigido: ${resultado.score.corrigido}/100
Melhoria: +${melhoria} pontos (${percentualMelhoria}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RESUMO DAS CORREÇÕES:

🔴 Críticas:     ${correcoesCriticas}
🟡 Importantes:  ${correcoesImportantes}
🔵 Sugestões:    ${sugestoes}
━━━━━━━━━━━━━━━━━
Total:           ${resultado.correcoes.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✏️ CORREÇÕES DETALHADAS:

${resultado.correcoes.map((c, i) => `
${i + 1}. [${c.gravidade}] ${c.tipo}
   Original:  "${c.original}"
   Corrigido: "${c.corrigido}"
   💡 ${c.explicacao}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 SUGESTÕES GERAIS:

${resultado.sugestoes.map((s, i) => `${i + 1}. ${s}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ MELHORIAS APLICADAS:

${resultado.melhorias.map((m, i) => `${i + 1}. ${m}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sistema: AVOCUSS | Correção por IA com Google Gemini
═══════════════════════════════════════════════════
`;
}

/**
 * Obtém cor para tipo de correção
 */
export function obterCorTipoCorrecao(tipo: TipoCorrecao): string {
  const cores = {
    GRAMATICA: '#ef4444', // red-500
    TERMO_JURIDICO: '#8b5cf6', // violet-500
    CLAREZA: '#3b82f6', // blue-500
    FORMATACAO: '#f59e0b', // amber-500
    ESTILO: '#10b981', // green-500
  };
  return cores[tipo];
}

/**
 * Obtém ícone para tipo de correção
 */
export function obterIconeTipoCorrecao(tipo: TipoCorrecao): string {
  const icones = {
    GRAMATICA: '✏️',
    TERMO_JURIDICO: '⚖️',
    CLAREZA: '💡',
    FORMATACAO: '📐',
    ESTILO: '🎨',
  };
  return icones[tipo];
}

/**
 * Salva correção no histórico
 */
export function salvarCorrecaoHistorico(resultado: CorrecaoTexto): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const historico = obterHistoricoCorrecoes();
      historico.push({
        resultado,
        data: new Date().toISOString(),
      });
      
      // Manter apenas últimas 15 correções
      const historicoLimitado = historico.slice(-15);
      window.localStorage.setItem('historico_correcoes', JSON.stringify(historicoLimitado));
    }
  } catch (error) {
    console.warn('Erro ao salvar histórico:', error);
  }
}

/**
 * Obtém histórico de correções
 */
export function obterHistoricoCorrecoes(): Array<{ resultado: CorrecaoTexto; data: string }> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('historico_correcoes');
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (error) {
    console.warn('Erro ao ler histórico:', error);
  }
  return [];
}
