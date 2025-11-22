// Configurações específicas para IA jurídica
export interface LegalCase {
  type: 'civil' | 'penal' | 'trabalhista' | 'tributario' | 'familia' | 'constitucional' | 'administrativo' | 'consumidor';
  complexity: 'baixa' | 'media' | 'alta';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
}

export const legalPromptSystem = `
Você é a Avocuss, assistente virtual especializada em Direito Brasileiro. Seja CONCISA, PRÁTICA e DIRETA.

IMPORTANTE SOBRE FLUXO:
- A aplicação realiza uma checagem heurística prévia (keywords) apenas como referência. Mesmo que essa checagem suspeite que o texto NÃO seja jurídico, NÃO BLOQUEIE a análise: sempre processe a entrada completa através do modelo Gemini e use o histórico fornecido.
- Use a base de conhecimento (lista de palavras-chave, trechos legais e exemplos) apenas como contexto/background — é APOIO ao raciocínio, não uma lista de exclusão.

SEGURANÇA E RECUSA (regras obrigatórias):
- Se a consulta estiver FORA DO DOMÍNIO JURÍDICO (i.e., não envolve leis, procedimentos, provas, responsabilidade, direitos, deveres, penalidades ou prática jurídica brasileira), responda EXCLUSIVAMENTE com a mensagem de recusa padronizada abaixo e nada mais.
- Se a consulta pede instruções para cometer crime, ferir alguém, burlar a lei ou realizar dano (ex: "como matar", "como fraudar", "como evitar a polícia"), NÃO forneça instruções ou métodos. Nesse caso, recuse a instrução e, se apropriado, descreva apenas as POSSÍVEIS CONSEQUÊNCIAS LEGAIS (penas, artigos relevantes, medidas legais aplicáveis) e encoraje comportamento legal, contato com autoridades competentes e/ou buscar assistência profissional.
- Em caso de risco à integridade física ou ameaça imediata, sugira procurar autoridades locais e serviços de emergência; não forneça conselhos operacionais.

- Mensagem padronizada de recusa (quando aplicável):
  "Desculpe — não posso responder perguntas que não estejam relacionadas ao direito brasileiro. Posso ajudar com dúvidas sobre legislação, procedimentos judiciais, provas, contratos e orientações jurídicas práticas."

COMO DECIDIR:
- Sempre avalie o texto e o histórico. Se houver ambiguidade, peça esclarecimento em vez de recusar imediatamente. Se for jurídico, responda com orientação prática e referências.

FORMATO DE RESPOSTA (MÁXIMO 150 PALAVRAS):
1. Resposta direta e prática em 1-2 frases.
2. Um ou dois artigos/trechos legais relevantes (referência curta) quando houver.
3. Próximo passo prático em 1 frase (ex: buscar advogado, registrar B.O., reunir provas).
4. Disclaimer obrigatório: "Esta orientação não substitui consulta jurídica." 

ÁREAS DE ATUAÇÃO:
- Direito Civil, Penal, Trabalhista, Tributário, Consumidor, Família, Constitucional, Administrativo

DIRETRIZES:
- Seja objetiva e prática na resposta
- Use linguagem simples
- Cite apenas 1-2 artigos principais quando pertinente
- Sempre termine com disclaimer
- Respeite as regras de segurança e recusa
- NÃO responda perguntas fora do contexto jurídico
- Sempre verifique o contexto e histórico antes de recusar
- Analise a linguagem cuidadosamente para identificar nuances jurídicas
- Analise a linguagem cuidadosamente para identificar se a pessoa está buscando cometer um ato ilegal
- Analise a pergunta para determinar se é uma dúvida que pode vir a ser um crime ou ato ilegal, sempre que perceber que for deve responder com a mensagem de recusa padronizada acima.
`;

export const legalKnowledgeBase = {
  codigoCivil: {
    responsabilidadeCivil: {
      artigo186: "Art. 186. Aquele que, por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem, ainda que exclusivamente moral, comete ato ilícito.",
      artigo927: "Art. 927. Aquele que, por ato ilícito (arts. 186 e 187), causar dano a outrem, fica obrigado a repará-lo.",
    },
    contratos: {
      artigo421: "Art. 421. A liberdade contratual será exercida nos limites da função social do contrato.",
      artigo422: "Art. 422. Os contratantes são obrigados a guardar, assim na conclusão do contrato, como em sua execução, os princípios de probidade e boa-fé.",
    }
  },
  
  codigoPenal: {
    crimes: {
      artigo121: "Art. 121. Matar alguém: Pena - reclusão, de seis a vinte anos.",
      artigo155: "Art. 155. Subtrair, para si ou para outrem, coisa alheia móvel: Pena - reclusão, de um a quatro anos, e multa.",
    }
  },
  
  clt: {
    artigo7: "Art. 7º São direitos dos trabalhadores urbanos e rurais, além de outros que visem à melhoria de sua condição social",
    artigo482: "Art. 482. Constituem justa causa para rescisão do contrato de trabalho pelo empregador..."
  },
  
  cdc: {
    artigo6: "Art. 6º São direitos básicos do consumidor",
    artigo14: "Art. 14. O fornecedor de serviços responde, independentemente da existência de culpa, pela reparação dos danos causados aos consumidores"
  },
  
  // Súmulas e jurisprudências importantes
  sumulas: {
    stf: [
      "Súmula 331: A contratação de servidor público, após a CF/88, sem prévia aprovação em concurso público, encontra óbice no respectivo art. 37, II e § 2º, somente lhe conferindo direito ao pagamento da contraprestação pactuada, em caráter excepcional e em razão do princípio da vedação ao enriquecimento sem causa da Administração Pública.",
    ],
    stj: [
      "Súmula 54: Os juros moratórios fluem a partir do evento danoso, em caso de responsabilidade extracontratual.",
      "Súmula 362: A correção monetária do valor da indenização do dano moral incide desde a data do arbitramento.",
    ]
  }
};

// Palavras-chave que indicam contexto jurídico
export const legalKeywords = [
  // Termos jurídicos gerais
  'advogado', 'lei', 'direito', 'artigo', 'código', 'jurisprudência', 'tribunal', 'justiça',
  'processo', 'ação', 'recurso', 'sentença', 'acórdão', 'liminar', 'decisão', 'juiz',
  'vara', 'fórum', 'cartório', 'audiência', 'testemunha', 'prova', 'defesa',
  
  // Direito Civil
  'contrato', 'indenização', 'danos morais', 'responsabilidade civil', 'negligência',
  'divórcio', 'casamento', 'herança', 'sucessão', 'inventário', 'testamento',
  'separação', 'união estável', 'regime de bens', 'meação', 'partilha',
  
  // Direito Penal
  'crime', 'delito', 'furto', 'roubo', 'homicídio', 'lesão corporal', 'estelionato',
  'delegacia', 'boletim de ocorrência', 'prisão', 'liberdade', 'fiança', 'cadeia',
  'preso', 'detento', 'condenação', 'absolvição', 'inocente', 'culpado',
  
  // Direito Trabalhista
  'demissão', 'rescisão', 'CLT', 'empregado', 'empregador', 'salário', 'FGTS',
  'horas extras', 'férias', 'aviso prévio', 'justa causa', 'trabalhista',
  'carteira assinada', 'registro', 'sindicato', 'reclamação trabalhista',
  
  // Direito do Consumidor
  'CDC', 'consumidor', 'fornecedor', 'produto defeituoso', 'garantia', 'procon',
  'vício', 'serviço mal prestado', 'propaganda enganosa', 'compra', 'venda',
  
  // Direito de Família
  'pensão alimentícia', 'pensão', 'alimentos', 'guarda', 'visitação', 'adoção', 
  'paternidade', 'maternidade', 'filho', 'filha', 'pai', 'mãe', 'genitor',
  'menor', 'criança', 'adolescente', 'tutela', 'curatela',
  
  // Direitos em geral
  'constituição', 'direitos fundamentais', 'habeas corpus', 'mandado de segurança',
  'servidor público', 'concurso público', 'licitação', 'imposto', 'tributo',
  'multa', 'infração', 'penalidade', 'sanção', 'punição',
  
  // Verbos e ações jurídicas
  'processar', 'acionar', 'denunciar', 'reclamar', 'contestar', 'apelar',
  'executar', 'cobrar', 'pagar', 'dever', 'obrigar', 'proibir', 'permitir',
  
  // Situações comuns
  'atraso', 'atrasar', 'inadimplência', 'calote', 'golpe', 'fraude',
  'acidente', 'batida', 'colisão', 'atropelamento', 'queda', 'dano',
  'vizinho', 'vizinhança', 'condomínio', 'síndico', 'assembleia'
];

// Função para verificar se a pergunta é relacionada ao contexto jurídico
export function isLegalContext(message: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // remove punctuation
      .replace(/\s+/g, ' ')
      .trim();

  const normalized = normalize(message);
  const tokens = normalized.split(' ').filter(Boolean);

  // quick regex checks (kept and normalized to be more flexible)
  const legalPatterns = [
    /posso.*processar/i,
    /posso.*ser.*preso/i,
    /é.*crime/i,
    /tenho.*direito/i,
    /o.*que.*fazer/i,
    /como.*proceder/i,
    /qual.*lei/i,
    /artigo.*c[oó]digo/i,
    /jurisprudencia/i,
    /tribunal/i,
    /posso.*reclamar/i,
    /devo.*pagar/i,
    /obrigado.*pagar/i,
    /preciso.*advogado/i,
    /pode.*dar.*presa?o/i,
    /vou.*preso/i,
    /se\s+eu\s+matar/i,
    /se\s+.*matar/i,
    /vou\s+ser\s+preso/i,
    /vou.*ser.*preso/i
  ];
  // Testa os padrões contra a versão normalizada (remove pontuação/acentos)
  if (legalPatterns.some(p => p.test(normalized))) return true;

  // important legal verb and consequence token sets
  const legalVerbs = [
    'processar','processo','denunciar','acusar','matei','matar','roubei','roubar','furtei','furtar',
    'agredi','agredir','ameaçar','difamar','contestar','apelar','executar','cobrar','pagar','devo','dever',
    'obrigado','preciso','reclamar','suspender','anular','impetrar','impetrar','recorrer','recuso'
  ];
  const consequenceNouns = [
    'pena','prisao','prisão','multa','indenizacao','indenizar','condenacao','condenação',
    'danos','danos morais','responsabilidade','reparacao','reparar','perda','sançao','sancao', 'pena de morte', 'cadeia'
  ];

  // flatten known keywords sets for fuzzy checking
  const additionalKeywords = [
    ...legalKeywords.map(k => k.toLowerCase()),
    ...Object.values(caseTypeIdentifiers).flat()
  ].map(k => normalize(k));

  // Levenshtein distance for simple fuzzy matches (works on single tokens)
  function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const v0 = new Array(n + 1).fill(0).map((_, i) => i);
    const v1 = new Array(n + 1).fill(0);
    for (let i = 0; i < m; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < n; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= n; j++) v0[j] = v1[j];
    }
    return v1[n];
  }

  function fuzzyTokenMatch(token: string, candidate: string): boolean {
    if (token === candidate) return true;
    const d = levenshtein(token, candidate);
    // allow small typos: tolerate distance 1 for short words, 2 for longer ones
    return (candidate.length <= 4 && d <= 1) || (candidate.length > 4 && d <= 2);
  }

  // Check exact substring matches on normalized text first (fast, reliable)
  if (additionalKeywords.some(k => k && normalized.includes(k))) return true;

  // Fuzzy match against tokens (covers misspellings like "pessoal" -> "pessoa")
  const tokenMatchesAnyKeyword = tokens.some(t =>
    additionalKeywords.some(k => {
      // check each word of multi-word keywords separately
      if (k.includes(' ')) {
        return k.split(' ').every(part => tokens.some(tok => fuzzyTokenMatch(tok, part)));
      }
      return fuzzyTokenMatch(t, k);
    })
  );
  if (tokenMatchesAnyKeyword) return true;

  // Check for verb + consequence co-occurrence (covers "matei ... qual a pena?")
  const hasVerb = tokens.some(t => legalVerbs.some(v => fuzzyTokenMatch(t, normalize(v))));
  const hasConsequence = tokens.some(t => consequenceNouns.some(c => fuzzyTokenMatch(t, normalize(c))));
  if (hasVerb && hasConsequence) return true;

  // Also check combinations of any legal verb + any legal keyword (e.g., "matei pessoa")
  const hasAnyLegalKeywordToken = tokens.some(t =>
    additionalKeywords.some(k => fuzzyTokenMatch(t, k))
  );
  if (hasVerb && hasAnyLegalKeywordToken) return true;

  // Fallback: small n-gram scan for important words even if split ("danos morais" -> tokens "danos" +"morais")
  for (let i = 0; i < tokens.length; i++) {
    const bigram = (tokens[i] + ' ' + (tokens[i + 1] || '')).trim();
    if (additionalKeywords.some(k => k === bigram)) return true;
  }

  return false;
}

export const caseTypeIdentifiers = {
  civil: ['contrato', 'indenização', 'danos morais', 'família', 'divórcio', 'herança', 'sucessão', 'responsabilidade civil'],
  penal: ['crime', 'homicídio', 'furto', 'roubo', 'estelionato', 'lesão corporal', 'processo criminal', 'delegacia'],
  trabalhista: ['demissão', 'rescisão', 'horas extras', 'FGTS', 'trabalhador', 'empregado', 'CLT', 'justa causa'],
  tributario: ['imposto', 'ICMS', 'IPI', 'IR', 'IPTU', 'sonegação', 'tributo', 'receita federal'],
  familia: ['divórcio', 'pensão alimentícia', 'guarda', 'adoção', 'casamento', 'união estável'],
  constitucional: ['mandado de segurança', 'habeas corpus', 'direitos fundamentais', 'ADI', 'ADPF'],
  administrativo: ['servidor público', 'licitação', 'concurso público', 'administração pública'],
  consumidor: ['produto defeituoso', 'serviço mal prestado', 'CDC', 'fornecedor', 'consumidor', 'vício']
};

export function identifyCaseType(message: string): LegalCase['type'] {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(caseTypeIdentifiers)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type as LegalCase['type'];
    }
  }
  
  return 'civil';
}

export interface GeneratePromptOptions {
  preCheckSuspectedNonLegal?: boolean; // true se a checagem heurística suspeita NÃO jurídico
  historySummary?: string; // resumo curto do histórico, se disponível
}

export function generateLegalPrompt(caseType: LegalCase['type'], userMessage: string, options?: GeneratePromptOptions): string {
  const specificGuidance = {
    civil: "Resposta direta sobre responsabilidade civil ou contratos. Cite CC quando aplicável.",
    penal: "Resposta objetiva sobre tipificação criminal. Cite CP quando aplicável.",
    trabalhista: "Resposta prática sobre direitos trabalhistas. Cite CLT quando aplicável.",
    tributario: "Resposta clara sobre obrigações tributárias. Cite CTN quando aplicável.",
    familia: "Resposta direta sobre direito de família. Cite CC quando aplicável.",
    constitucional: "Resposta objetiva sobre direitos fundamentais. Cite CF quando aplicável.",
    administrativo: "Resposta prática sobre atos administrativos. Cite leis específicas.",
    consumidor: "Resposta clara sobre direitos do consumidor. Cite CDC quando aplicável."
  };
  const preCheckNote = options?.preCheckSuspectedNonLegal
    ? "OBS: A checagem heurística prévia indicou que parte do texto pode NÃO ser claramente jurídico. NÃO interrompa a análise por causa disso; investigue contexto e histórico." 
    : "";

  const sampleKeywords = legalKeywords.slice(0, 24).join(', ');

  return `${legalPromptSystem}

CASO: ${caseType.toUpperCase()}
ORIENTAÇÃO ESPECÍFICA: ${specificGuidance[caseType]}

CONTEXTO/BACKGROUND (use como conhecimento de apoio, não como regra rígida): ${sampleKeywords}
${preCheckNote}

HISTÓRICO RESUMIDO: ${options?.historySummary ?? "(nenhum)"}

CONSULTA: "${userMessage}"

RESPONDA DE FORMA CONCISA E PRÁTICA (MÁXIMO 150 PALAVRAS):`;
}
