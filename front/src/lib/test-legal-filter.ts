// Teste do filtro jurídico melhorado
import { isLegalContext } from './legal-ai-config';

// Testes de perguntas que DEVEM ser aceitas
const testQuestions = [
  "Se eu atrasar a pensão do meu filho em 2 dias posso ser preso?",
  "O que acontece se não pagar o IPTU?",
  "Posso ser demitido por chegar atrasado?",
  "Meu vizinho faz barulho toda noite, o que fazer?",
  "Atrasei a pensão, posso ser preso?",
  "Preciso advogado para divórcio?",
  "Devo pagar multa de trânsito?",
  "É crime não pagar pensão alimentícia?",
  "Posso processar meu empregador?",
  "Tenho direito a indenização?"
];

// Testes de perguntas que DEVEM ser rejeitadas
const rejectedQuestions = [
  "Como fazer um bolo de chocolate?",
  "Qual o melhor celular para comprar?",
  "Como você está hoje?",
  "Receita de macarrão",
  "Previsão do tempo"
];

console.log("=== PERGUNTAS QUE DEVEM SER ACEITAS ===");
testQuestions.forEach(question => {
  const result = isLegalContext(question);
  console.log(`${result ? '✅' : '❌'} "${question}"`);
});

console.log("\n=== PERGUNTAS QUE DEVEM SER REJEITADAS ===");
rejectedQuestions.forEach(question => {
  const result = isLegalContext(question);
  console.log(`${!result ? '✅' : '❌'} "${question}"`);
});

export { testQuestions, rejectedQuestions };
