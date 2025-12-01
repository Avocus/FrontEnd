"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Serviço de análise preditiva de chances de sucesso de processos jurídicos
 */

export interface DadosAnalise {
  tipoProcesso: string;
  descricao: string;
  provas: string[];
  testemunhas?: number;
  jurisprudenciasFavoraveis?: boolean;
  contextoAdicional?: string;
}

export interface AnaliseChances {
  probabilidade: number; // 0-100
  classificacao: 'ALTA' | 'MEDIA' | 'BAIXA' | 'MUITO_BAIXA';
  pontosFortes: string[];
  pontosFracos: string[];
  recomendacoes: string[];
  provasNecessarias: string[];
  riscos: string[];
  prazoEstimado?: string;
  fundamentacao: string;
}

/**
 * Analisa as chances de sucesso de um processo jurídico
 */
export async function analisarChancesProcesso(dados: DadosAnalise): Promise<AnaliseChances> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
  
  if (!apiKey) {
    throw new Error('Chave da API Gemini não configurada');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = construirPromptAnalise(dados);

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.2, // Mais determinístico para análises
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
      // Tentativa de limpeza
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

    const analise = parsed as AnaliseChances;

    // Validar e normalizar dados
    analise.probabilidade = Math.max(0, Math.min(100, analise.probabilidade));
    analise.classificacao = classificarProbabilidade(analise.probabilidade);

    return analise;
  } catch (error) {
    console.error('Erro ao analisar chances:', error);
    throw new Error('Falha ao analisar processo. Tente novamente.');
  }
}

/**
 * Constrói o prompt para análise de chances
 */
function construirPromptAnalise(dados: DadosAnalise): string {
  const provasFormatadas = dados.provas.join('\n- ');
  const temTestemunhas = dados.testemunhas ? `Testemunhas disponíveis: ${dados.testemunhas}` : '';
  const jurisprudencia = dados.jurisprudenciasFavoraveis ? 'Há jurisprudências favoráveis' : 'Jurisprudências não verificadas';

  return `Você é um advogado experiente com anos de prática em ${dados.tipoProcesso} no Brasil.

Analise OBJETIVAMENTE e HONESTAMENTE a viabilidade do caso descrito abaixo.

DADOS DO CASO:
═══════════════════

TIPO DE PROCESSO: ${dados.tipoProcesso}

DESCRIÇÃO DO CASO:
${dados.descricao}

PROVAS DISPONÍVEIS:
- ${provasFormatadas}

${temTestemunhas}
${jurisprudencia}

${dados.contextoAdicional ? `
CONTEXTO ADICIONAL:
${dados.contextoAdicional}
` : ''}

═══════════════════

INSTRUÇÕES DE ANÁLISE:
━━━━━━━━━━━━━━━━━━━━

Forneça uma análise REALISTA considerando:
1. Legislação brasileira vigente
2. Jurisprudência dos tribunais superiores
3. Qualidade e suficiência das provas
4. Pontos fortes E fracos (seja crítico)
5. Riscos processuais
6. Custos x Benefícios

Responda ESTRITAMENTE em JSON com a seguinte estrutura:

{
  "probabilidade": [número de 0 a 100],
  "classificacao": "ALTA" | "MEDIA" | "BAIXA" | "MUITO_BAIXA",
  "pontosFortes": ["ponto forte 1", "ponto forte 2", ...],
  "pontosFracos": ["ponto fraco 1", "ponto fraco 2", ...],
  "recomendacoes": ["recomendação estratégica 1", "recomendação 2", ...],
  "provasNecessarias": ["prova adicional 1", "prova 2", ...],
  "riscos": ["risco 1", "risco 2", ...],
  "prazoEstimado": "estimativa de tempo processual",
  "fundamentacao": "breve explicação da análise (máx 500 caracteres)"
}

IMPORTANTE:
- Seja HONESTO: se o caso é fraco, indique baixa probabilidade
- Liste TODOS os pontos fracos identificados
- Não omita riscos para agradar o cliente
- Fundamentação deve ser objetiva e técnica

Responda APENAS com o JSON, sem texto adicional.`;
}

/**
 * Classifica a probabilidade em categorias
 */
function classificarProbabilidade(prob: number): AnaliseChances['classificacao'] {
  if (prob >= 75) return 'ALTA';
  if (prob >= 50) return 'MEDIA';
  if (prob >= 25) return 'BAIXA';
  return 'MUITO_BAIXA';
}

/**
 * Retorna cor para exibição baseada na classificação
 */
export function obterCorClassificacao(classificacao: AnaliseChances['classificacao']): string {
  const cores = {
    ALTA: '#22c55e', // green-500
    MEDIA: '#eab308', // yellow-500
    BAIXA: '#f97316', // orange-500
    MUITO_BAIXA: '#ef4444', // red-500
  };
  return cores[classificacao];
}

/**
 * Retorna emoji para classificação
 */
export function obterEmojiClassificacao(classificacao: AnaliseChances['classificacao']): string {
  const emojis = {
    ALTA: '🟢',
    MEDIA: '🟡',
    BAIXA: '🟠',
    MUITO_BAIXA: '🔴',
  };
  return emojis[classificacao];
}

/**
 * Gera relatório textual da análise
 */
export function gerarRelatorioAnalise(analise: AnaliseChances, dados: DadosAnalise): string {
  const emoji = obterEmojiClassificacao(analise.classificacao);
  
  return `
═══════════════════════════════════════════════════
    ANÁLISE DE VIABILIDADE PROCESSUAL
═══════════════════════════════════════════════════

Tipo de Processo: ${dados.tipoProcesso}
Data da Análise: ${new Date().toLocaleDateString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBABILIDADE DE SUCESSO: ${analise.probabilidade}% ${emoji}
Classificação: ${analise.classificacao.replace('_', ' ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PONTOS FORTES:
${analise.pontosFortes.map((p, i) => `${i + 1}. ${p}`).join('\n')}

❌ PONTOS FRACOS:
${analise.pontosFracos.map((p, i) => `${i + 1}. ${p}`).join('\n')}

💡 RECOMENDAÇÕES ESTRATÉGICAS:
${analise.recomendacoes.map((r, i) => `${i + 1}. ${r}`).join('\n')}

📄 PROVAS NECESSÁRIAS:
${analise.provasNecessarias.map((p, i) => `${i + 1}. ${p}`).join('\n')}

⚠️ RISCOS PROCESSUAIS:
${analise.riscos.map((r, i) => `${i + 1}. ${r}`).join('\n')}

⏱️ PRAZO ESTIMADO: ${analise.prazoEstimado || 'Não estimado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNDAMENTAÇÃO:
${analise.fundamentacao}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ AVISO IMPORTANTE:
Esta análise é uma estimativa baseada em IA e não constitui 
garantia de resultado. A decisão final cabe ao advogado responsável
após análise detalhada do caso.

Sistema: AVOCUSS | Gerado por IA com Google Gemini
═══════════════════════════════════════════════════
`;
}

/**
 * Salva análise no histórico local
 */
export function salvarAnaliseHistorico(analise: AnaliseChances, dados: DadosAnalise): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const historico = obterHistoricoAnalises();
      historico.push({
        analise,
        dados,
        data: new Date().toISOString(),
      });
      
      // Manter apenas últimas 10 análises
      const historicoLimitado = historico.slice(-10);
      window.localStorage.setItem('historico_analises', JSON.stringify(historicoLimitado));
    }
  } catch (error) {
    console.warn('Erro ao salvar histórico:', error);
  }
}

/**
 * Obtém histórico de análises
 */
export function obterHistoricoAnalises(): Array<{ analise: AnaliseChances; dados: DadosAnalise; data: string }> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('historico_analises');
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (error) {
    console.warn('Erro ao ler histórico:', error);
  }
  return [];
}
