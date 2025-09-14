# Guia de Treinamento da IA Jurídica Avocuss

## 🎯 Visão Geral

O sistema de IA jurídica da Avocuss foi desenvolvido utilizando o Google Gemini como base, com especializações específicas para o direito brasileiro. Este guia explica como treinar e customizar a IA para casos jurídicos específicos.

## 🧠 Arquitetura da IA

### Componentes Principais

1. **Sistema de Prompts Especializados** (`legal-ai-config.ts`)
   - Prompts específicos por área jurídica
   - Contextualização automática baseada no tipo de consulta
   - Referências legais integradas

2. **Base de Conhecimento Jurídico** (`legal-knowledge-base.ts`)
   - Artigos de leis (CC, CP, CLT, CDC, CF/88)
   - Súmulas e jurisprudências (STF, STJ, TST)
   - Sistema de busca por palavra-chave

3. **Configurações Avançadas** (`legal-ai-advanced-config.ts`)
   - Templates de resposta por área
   - Sistema de avaliação de confiança
   - Configurações de compliance

## 📚 Como Treinar a IA

### 1. Adicionando Nova Legislação

Para adicionar novos artigos ou leis:

```typescript
// Em legal-knowledge-base.ts
export const extendedLegalKnowledge = {
  // Adicione nova seção
  novaLei: {
    secao1: {
      artigo1: "Art. 1º Texto do artigo...",
      artigo2: "Art. 2º Texto do artigo..."
    }
  }
};
```

### 2. Criando Novos Tipos de Casos

Para adicionar um novo tipo de caso jurídico:

```typescript
// Em legal-ai-config.ts
export const caseTypeIdentifiers = {
  // Adicione novo tipo
  empresarial: ['empresa', 'sociedade', 'sócio', 'CNPJ', 'contrato social'],
  // ...
};

// Adicione também no enum LegalCase
export interface LegalCase {
  type: 'civil' | 'penal' | 'trabalhista' | 'empresarial' | /* outros tipos */;
  // ...
}
```

### 3. Customizando Prompts por Área

Para especializar prompts para uma área específica:

```typescript
// Em legal-ai-config.ts
const specificGuidance = {
  empresarial: "Analise sob ótica do direito empresarial. Considere Lei das S.A., Código Civil empresarial, e jurisprudências comerciais.",
  // ...
};
```

## 🎨 Personalizando a Interface

### Adicionando Novos Badges de Categoria

```typescript
// Em chatAvocuss.tsx
const getCaseTypeColor = (caseType: LegalCase['type']) => {
  const colors = {
    empresarial: "bg-indigo-100 text-indigo-800",
    // ...
  };
  return colors[caseType] || "bg-gray-100 text-gray-800";
};
```

## 🔍 Melhorando a Precisão das Respostas

### 1. Adicionando Jurisprudências Específicas

```typescript
// Em legal-knowledge-base.ts
jurisprudencias: {
  stf: [
    {
      sumula: "Súmula XXX",
      texto: "Texto da súmula...",
      area: "empresarial" // Nova área
    }
  ]
}
```

### 2. Refinando Detecção de Casos

Para melhorar a identificação automática do tipo de caso:

1. Analise mensagens que foram mal categorizadas
2. Adicione palavras-chave relevantes em `caseTypeIdentifiers`
3. Teste com casos reais

### 3. Ajustando Configurações do Gemini

```typescript
const generationConfig = {
  temperature: 0.3, // Menor = mais conservador
  topP: 0.9,        // Controla diversidade
  topK: 40,         // Limitador de tokens
  maxOutputTokens: 8192,
};
```

## 📊 Monitoramento e Métricas

### Implementando Feedback de Qualidade

1. **Coleta de Feedback**:
   - Adicione botões de "útil/não útil" nas respostas
   - Colete dados de satisfação

2. **Análise de Desempenho**:
   - Monitore tipos de caso mais consultados
   - Identifique áreas que precisam mais treinamento

3. **Métricas de Qualidade**:
   ```typescript
   // Use a função calculateResponseConfidence
   const confidence = calculateResponseConfidence(
     caseType,
     'medium', // complexidade
     legalReferences.length
   );
   ```

## 🚀 Implementação de Melhorias

### 1. Sistema de Aprendizado Contínuo

```typescript
// Implementar sistema que aprende com interações
interface LearningData {
  query: string;
  response: string;
  userFeedback: 'positive' | 'negative';
  caseType: string;
  timestamp: Date;
}
```

### 2. Integração com APIs Externas

- **Portal da Transparência**: Para consulta de processos
- **Planalto**: Para legislação atualizada
- **STF/STJ**: Para jurisprudências recentes

### 3. Cache de Respostas Comuns

```typescript
// Sistema de cache para perguntas frequentes
const responseCache = new Map<string, string>();

if (responseCache.has(normalizedQuery)) {
  return responseCache.get(normalizedQuery);
}
```

## 🛡️ Considerações de Segurança e Ética

### 1. Validação de Entrada

- Filtre conteúdo inadequado
- Detecte tentativas de obter orientações para atividades ilegais
- Implemente rate limiting

### 2. Disclaimers Obrigatórios

Sempre inclua:
- "Esta orientação não substitui consulta presencial"
- "Análise específica do caso é necessária"
- "Prazos podem variar conforme jurisdição"

### 3. Conformidade com OAB

- Não forneça orientações que configurem exercício ilegal da advocacia
- Mantenha transparência sobre limitações da IA
- Recomende consulta a advogado quando apropriado

## 📋 Lista de Verificação para Deploys

Antes de fazer deploy de atualizações:

- [ ] Testou novos tipos de caso
- [ ] Validou referências legais
- [ ] Verificou disclaimers apropriados
- [ ] Testou edge cases
- [ ] Documentou mudanças

## 🔄 Processo de Atualização Contínua

### Ciclo Semanal
1. **Segunda**: Análise de feedback da semana anterior
2. **Quarta**: Implementação de melhorias identificadas
3. **Sexta**: Testes e deploy das atualizações

### Ciclo Mensal
1. Revisão completa da base de conhecimento
2. Atualização de jurisprudências
3. Análise de novas demandas legais

## 🆘 Solução de Problemas Comuns

### IA dá respostas muito genéricas
- Adicione mais contexto específico nos prompts
- Melhore identificação do tipo de caso
- Inclua mais referências legais relevantes

### Categorização incorreta de casos
- Revise palavras-chave em `caseTypeIdentifiers`
- Adicione exemplos de treinamento
- Ajuste algoritmo de detecção

### Respostas muito técnicas
- Ajuste temperatura do modelo
- Customize prompts para audiência específica
- Implemente diferentes níveis de complexidade

---

**Contato**: Para dúvidas sobre o treinamento da IA, entre em contato com a equipe de desenvolvimento.
