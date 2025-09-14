// Configurações específicas para IA jurídica
export interface LegalCase {
  type: 'civil' | 'penal' | 'trabalhista' | 'tributario' | 'familia' | 'constitucional' | 'administrativo' | 'consumidor';
  complexity: 'baixa' | 'media' | 'alta';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
}

export const legalPromptSystem = `
Você é a Avocuss, uma assistente virtual especializada em Direito Brasileiro. Seja CONCISA e DIRETA.

FORMATO DE RESPOSTA (MÁXIMO 150 PALAVRAS):
1. Resposta direta em 1-2 frases
2. Artigo de lei aplicável (apenas número e resumo)
3. Próximo passo prático em 1 frase
4. Disclaimer obrigatório

EXEMPLO DE RESPOSTA:
"Sim, você pode processar por danos morais. Art. 186 CC - ato ilícito gera dever de indenizar. Procure um advogado com as provas dos danos. *Esta orientação não substitui consulta jurídica.*"

ÁREAS DE ATUAÇÃO:
- Direito Civil, Penal, Trabalhista, Tributário, Consumidor, Família, Constitucional, Administrativo

DIRETRIZES:
- Seja objetiva e prática
- Use linguagem simples
- Cite apenas 1-2 artigos principais
- Sempre termine com disclaimer
- NÃO responda perguntas fora do contexto jurídico
`;

export const legalKnowledgeBase = {
  // Códigos e Leis principais
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
  const lowerMessage = message.toLowerCase();
  
  // Verifica se contém pelo menos uma palavra-chave jurídica
  const hasLegalKeyword = legalKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  // Verifica padrões comuns de perguntas jurídicas (mais flexível)
  const legalPatterns = [
    /posso.*processar/i,
    /posso.*ser.*preso/i,
    /é.*crime/i,
    /tenho.*direito/i,
    /o.*que.*fazer/i,
    /como.*proceder/i,
    /qual.*lei/i,
    /artigo.*código/i,
    /jurisprudência/i,
    /tribunal/i,
    /posso.*reclamar/i,
    /devo.*pagar/i,
    /obrigado.*pagar/i,
    /preciso.*advogado/i,
    /pode.*dar.*cadeia/i,
    /pode.*dar.*prisão/i,
    /vou.*preso/i,
    /posso.*ir.*preso/i,
    /atrasar.*pensão/i,
    /não.*pagar.*pensão/i,
    /deixar.*de.*pagar/i,
    /acontece.*se.*não.*pagar/i,
    /consequência.*de.*não/i,
    /multa.*por/i,
    /punição.*por/i
  ];
  
  const hasLegalPattern = legalPatterns.some(pattern => pattern.test(lowerMessage));
  
  // Verifica se é uma pergunta sobre consequências legais (muito comum)
  const consequencePatterns = [
    /o.*que.*acontece.*se/i,
    /posso.*ser/i,
    /vou.*ter.*que/i,
    /sou.*obrigado/i,
    /tenho.*obrigação/i,
    /é.*obrigatório/i,
    /preciso/i
  ];
  
  const hasConsequencePattern = consequencePatterns.some(pattern => pattern.test(lowerMessage)) &&
    (hasLegalKeyword || legalPatterns.some(pattern => pattern.test(lowerMessage)));
  
  return hasLegalKeyword || hasLegalPattern || hasConsequencePattern;
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
  
  return 'civil'; // default
}

export function generateLegalPrompt(caseType: LegalCase['type'], userMessage: string): string {
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
  
  return `${legalPromptSystem}

CASO: ${caseType.toUpperCase()}
ORIENTAÇÃO ESPECÍFICA: ${specificGuidance[caseType]}

CONSULTA: "${userMessage}"

RESPONDA DE FORMA CONCISA E PRÁTICA (MÁXIMO 150 PALAVRAS):`;
}
