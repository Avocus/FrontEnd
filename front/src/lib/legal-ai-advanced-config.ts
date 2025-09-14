/* eslint-disable @typescript-eslint/no-unused-vars */
// Configurações avançadas para treinamento e customização da IA jurídica
export const advancedLegalConfig = {
  // Configurações de treinamento específico
  trainingSettings: {
    // Áreas prioritárias para treinamento
    priorityAreas: [
      'direito_civil_responsabilidade',
      'direito_trabalhista_clt', 
      'direito_consumidor_cdc',
      'direito_penal_crimes_comuns',
      'direito_familia_divorcio'
    ],
    
    // Fontes de dados para treinamento
    dataSources: [
      'codigo_civil_brasileiro',
      'codigo_penal_brasileiro', 
      'clt_consolidacao',
      'codigo_defesa_consumidor',
      'constituicao_federal_1988',
      'sumulas_stf_stj_tst',
      'jurisprudencias_recentes'
    ],

    // Configurações de resposta
    responseStyle: {
      formal: true,
      didactic: true,
      includeLegalReferences: true,
      includeNextSteps: true,
      includeDisclaimers: true
    }
  },

  // Templates de resposta por área jurídica
  responseTemplates: {
    civil: {
      structure: [
        'Análise da situação',
        'Legislação aplicável',
        'Direitos e deveres',
        'Próximos passos',
        'Prazo para ação',
        'Documentação necessária'
      ],
      tone: 'formal_didático'
    },
    
    penal: {
      structure: [
        'Tipificação criminal',
        'Elementos do crime',
        'Penas previstas',
        'Excludentes de ilicitude',
        'Procedimento judicial',
        'Direitos do acusado'
      ],
      tone: 'formal_cauteloso'
    },
    
    trabalhista: {
      structure: [
        'Direitos trabalhistas envolvidos',
        'Artigos da CLT aplicáveis',
        'Jurisprudências relevantes',
        'Valor estimado da reclamação',
        'Documentos necessários',
        'Prazos legais'
      ],
      tone: 'prático_objetivo'
    }
  },

  // Palavras-chave para detecção de urgência
  urgencyKeywords: [
    'urgente', 'emergencial', 'prazo vencendo', 'audiência amanhã',
    'prisão', 'mandado', 'despejo', 'interdição', 'liminar',
    'habeas corpus', 'mandado de segurança', 'tutela antecipada'
  ],

  // Casos que requerem atenção especial
  specialAttentionCases: [
    'violencia_domestica',
    'crimes_contra_criancas',
    'trabalho_escravo',
    'racismo',
    'homofobia',
    'feminicidio',
    'lavagem_dinheiro'
  ],

  // Configurações de compliance e ética
  ethicsAndCompliance: {
    // Tópicos que não devem ser tratados
    restrictedTopics: [
      'orientacao_para_crimes',
      'sonegacao_fiscal',
      'corrupcao',
      'fraude_processual'
    ],
    
    // Sempre incluir disclaimers para
    mandatoryDisclaimers: [
      'consulta_presencial_recomendada',
      'analise_caso_especifico_necessaria',
      'informacoes_nao_substituem_advogado',
      'prazos_podem_variar'
    ]
  },

  // Métricas de qualidade das respostas
  qualityMetrics: {
    // Critérios de avaliação
    criteria: [
      'precisao_juridica',
      'clareza_explicacao',
      'completude_resposta',
      'referencias_legais_corretas',
      'orientacoes_praticas'
    ],
    
    // Feedback automático baseado em
    autoFeedback: [
      'resposta_muito_generica',
      'falta_referencias_legais',
      'linguagem_muito_tecnica',
      'orientacoes_incompletas'
    ]
  }
};

// Função para customizar resposta baseada no perfil do usuário
export function customizeResponseForUser(
  userType: 'advogado' | 'cliente' | 'estudante',
  _message: string,
  _caseType: string
) {
  const customizations = {
    advogado: {
      technicalLevel: 'advanced',
      includePrecedents: true,
      includeProcessualSteps: true,
      language: 'formal_technical'
    },
    cliente: {
      technicalLevel: 'basic',
      includePrecedents: false,
      includeProcessualSteps: false,
      language: 'informal_didactic'
    },
    estudante: {
      technicalLevel: 'intermediate',
      includePrecedents: true,
      includeProcessualSteps: false,
      language: 'didactic_explanatory'
    }
  };

  return customizations[userType];
}

// Sistema de avaliação de confiança da resposta
export function calculateResponseConfidence(
  caseType: string,
  queryComplexity: 'low' | 'medium' | 'high',
  availableReferences: number
): number {
  let confidence = 0.5; // Base confidence

  // Ajusta baseado no tipo de caso
  const caseTypeConfidence = {
    civil: 0.8,
    penal: 0.7, // Mais cauteloso em casos penais
    trabalhista: 0.85,
    consumidor: 0.9,
    familia: 0.75,
    tributario: 0.6,
    constitucional: 0.5,
    administrativo: 0.7
  };

  confidence *= caseTypeConfidence[caseType as keyof typeof caseTypeConfidence] || 0.5;

  // Ajusta baseado na complexidade
  const complexityModifier = {
    low: 1.2,
    medium: 1.0,
    high: 0.8
  };

  confidence *= complexityModifier[queryComplexity];

  // Ajusta baseado nas referências disponíveis
  confidence += (availableReferences * 0.05);

  return Math.min(confidence, 1.0); // Cap at 100%
}

// Sugestões de melhoria de pergunta
export function suggestBetterQuestion(originalQuestion: string): string[] {
  const suggestions = [];
  
  if (originalQuestion.length < 20) {
    suggestions.push("Forneça mais detalhes sobre sua situação específica");
  }
  
  if (!originalQuestion.includes('quando') && !originalQuestion.includes('onde')) {
    suggestions.push("Inclua informações sobre quando e onde os fatos ocorreram");
  }
  
  if (!originalQuestion.includes('valor') && !originalQuestion.includes('dano')) {
    suggestions.push("Se aplicável, mencione valores ou danos envolvidos");
  }
  
  return suggestions;
}
