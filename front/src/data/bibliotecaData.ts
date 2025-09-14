interface Content {
    id: number;
    titulo: string;
    categoria: string;
    imagem: string;
    subTitulo: string;
    resumo: string;
    conteudo: string;
    palavrasChave: string[];
    dataPublicacao: string;
    tempoLeitura: string;
}

export const categorias = [
    "Todos",
    "Direito Civil",
    "Direito Penal",
    "Direito Trabalhista",
    "Direito de Família",
    "Direito do Consumidor",
    "Direito Empresarial",
    "Direito Tributário",
    "Direito Administrativo",
    "Direito Previdenciário"
];

export const conteudos: Content[] = [
    {
        id: 1,
        titulo: "Direitos do Consumidor: Como Se Proteger de Práticas Abusivas",
        categoria: "Direito do Consumidor",
        imagem: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Conheça seus direitos e saiba quando e como reclamar",
        resumo: "O Código de Defesa do Consumidor garante diversos direitos fundamentais. Aprenda a identificar práticas abusivas e os meios para buscar reparação quando seus direitos forem violados.",
        conteudo: "O Código de Defesa do Consumidor (CDC), Lei nº 8.078/90, é uma das principais ferramentas de proteção aos direitos dos consumidores no Brasil. Este conjunto de normas estabelece direitos fundamentais como o direito à informação adequada e clara sobre produtos e serviços, o direito à proteção contra publicidade enganosa e práticas abusivas, e o direito à reparação de danos.\n\nEntre as práticas consideradas abusivas estão: vender produtos sem disponibilidade de peças de reposição, executar serviços sem prévia elaboração de orçamento, repassar informações depreciativas sobre consumidores inadimplentes, e colocar o consumidor em desvantagem exagerada.\n\nQuando seus direitos forem violados, você pode procurar os órgãos de defesa do consumidor como PROCON, Defensoria Pública, ou ajuizar ação judicial. Nos casos de relação de consumo, existe a inversão do ônus da prova, facilitando a defesa do consumidor.\n\nLembre-se: o prazo para reclamar de vícios aparentes é de 30 dias para produtos não duráveis e 90 dias para produtos duráveis. Para vícios ocultos, o prazo começa a contar da descoberta do defeito.",
        palavrasChave: ["CDC", "direitos do consumidor", "práticas abusivas", "PROCON", "vício do produto", "garantia"],
        dataPublicacao: "10 Set 2025",
        tempoLeitura: "8 min"
    },
    {
        id: 2,
        titulo: "Divórcio Consensual vs. Litigioso: Qual Escolher?",
        categoria: "Direito de Família",
        imagem: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Entenda as diferenças e escolha a melhor opção para seu caso",
        resumo: "Existem duas modalidades principais de divórcio: consensual e litigioso. Cada uma tem suas características, custos e prazos específicos. Saiba qual é mais adequada para sua situação.",
        conteudo: "O divórcio é o rompimento definitivo do vínculo matrimonial, podendo ser realizado de forma consensual ou litigiosa. No divórcio consensual, os cônjuges concordam com todas as condições da separação, incluindo partilha de bens, guarda dos filhos e pensão alimentícia.\n\nEste tipo de divórcio pode ser feito diretamente no cartório (divórcio extrajudicial), desde que não haja filhos menores ou incapazes, e ambos estejam representados por advogado. É mais rápido e econômico, sendo concluído em poucos dias.\n\nJá o divórcio litigioso ocorre quando não há acordo entre as partes sobre questões importantes. Neste caso, é necessário processo judicial, que pode demorar meses ou anos para ser concluído. O juiz decidirá sobre as questões controversas baseado nas provas apresentadas.\n\nIndependentemente do tipo escolhido, é importante ter assistência jurídica especializada para garantir que todos os direitos sejam preservados e que o processo transcorra da melhor forma possível.",
        palavrasChave: ["divórcio", "divórcio consensual", "divórcio litigioso", "cartório", "partilha de bens", "guarda dos filhos"],
        dataPublicacao: "12 Set 2025",
        tempoLeitura: "7 min"
    },
    {
        id: 3,
        titulo: "Crimes Cibernéticos: Como Se Proteger e Denunciar",
        categoria: "Direito Penal",
        imagem: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Marco Civil da Internet e Lei Carolina Dieckmann explicados",
        resumo: "Com o aumento da criminalidade digital, é essencial conhecer os tipos de crimes cibernéticos e saber como se proteger. A legislação brasileira prevê punições específicas para delitos virtuais.",
        conteudo: "Os crimes cibernéticos têm se tornado cada vez mais frequentes no Brasil. A Lei nº 12.737/2012 (Lei Carolina Dieckmann) criminalizou condutas como invasão de dispositivos informáticos e divulgação não autorizada de dados pessoais.\n\nOs principais tipos de crimes virtuais incluem: phishing (obtenção fraudulenta de dados), ransomware (sequestro de dados), cyberbullying, pornografia de vingança, e fraudes bancárias online. Cada um destes crimes tem previsão específica no Código Penal ou em leis especiais.\n\nPara se proteger, é fundamental: manter softwares atualizados, usar senhas complexas e únicas, não clicar em links suspeitos, verificar a autenticidade de sites antes de inserir dados pessoais, e fazer backup regular de informações importantes.\n\nEm caso de ser vítima, preserve todas as evidências (prints, e-mails, mensagens) e procure imediatamente uma delegacia especializada em crimes eletrônicos. O Boletim de Ocorrência pode ser feito online em muitos estados. A denúncia também pode ser feita através do site safernet.org.br.",
        palavrasChave: ["crimes virtuais", "Lei Carolina Dieckmann", "phishing", "cyberbullying", "ransomware", "delegacia eletrônica"],
        dataPublicacao: "11 Set 2025",
        tempoLeitura: "9 min"
    },
    {
        id: 4,
        titulo: "Rescisão Trabalhista: Direitos e Prazos que Todo Trabalhador Deve Conhecer",
        categoria: "Direito Trabalhista",
        imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Guia completo sobre verbas rescisórias e prazos para pagamento",
        resumo: "A rescisão do contrato de trabalho gera diversos direitos ao trabalhador. Conheça todas as verbas devidas e os prazos que o empregador deve cumprir para evitar multas.",
        conteudo: "A rescisão do contrato de trabalho pode ocorrer por iniciativa do empregado (pedido de demissão), do empregador (dispensa com ou sem justa causa), ou por acordo mútuo. Cada modalidade gera direitos específicos.\n\nNa dispensa sem justa causa, o trabalhador tem direito a: saldo de salário, férias vencidas e proporcionais com 1/3, 13º salário proporcional, aviso prévio (trabalhado ou indenizado), multa de 40% sobre o FGTS, e liberação do FGTS e seguro-desemprego.\n\nNo pedido de demissão, o trabalhador recebe: saldo de salário, férias vencidas com 1/3, e 13º proporcional. Se não cumprir aviso prévio, pode ter descontado um salário.\n\nO empregador tem até 10 dias após o término do contrato para pagar todas as verbas rescisórias. O atraso gera multa equivalente ao salário do empregado. É importante conferir todos os cálculos e guardar toda a documentação.\n\nEm caso de dúvidas ou irregularidades, procure o sindicato da categoria ou um advogado trabalhista.",
        palavrasChave: ["rescisão", "aviso prévio", "FGTS", "13º salário", "férias", "seguro-desemprego", "justa causa"],
        dataPublicacao: "13 Set 2025",
        tempoLeitura: "10 min"
    },
    {
        id: 5,
        titulo: "Contratos de Compra e Venda: Cláusulas Essenciais e Armadilhas Jurídicas",
        categoria: "Direito Civil",
        imagem: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Como elaborar e analisar contratos seguros",
        resumo: "Todo contrato de compra e venda deve conter elementos essenciais para ser válido. Aprenda a identificar cláusulas abusivas e proteger seus interesses em negociações.",
        conteudo: "O contrato de compra e venda é um dos mais comuns no dia a dia, regulamentado pelos artigos 481 a 532 do Código Civil. Para ser válido, deve conter elementos essenciais: partes capazes, objeto lícito e possível, e forma prescrita ou não defesa em lei.\n\nCláusulas essenciais incluem: identificação completa das partes, descrição detalhada do bem, preço e forma de pagamento, prazo e local de entrega, garantias oferecidas, e condições para rescisão.\n\nAtenção especial deve ser dada a cláusulas que podem ser consideradas abusivas, como: transferência total de responsabilidade para uma das partes, multas excessivas, prazos muito extensos para cumprimento de obrigações, ou limitação excessiva de direitos.\n\nEm contratos de consumo, aplicam-se as regras do CDC, que são mais protetivas. Cláusulas abusivas são nulas de pleno direito. Sempre leia todo o contrato antes de assinar e, em caso de dúvidas, consulte um advogado.\n\nGuarde sempre uma via original assinada e, se possível, registre o contrato em cartório para maior segurança jurídica.",
        palavrasChave: ["contrato", "compra e venda", "Código Civil", "cláusulas abusivas", "garantia", "rescisão"],
        dataPublicacao: "09 Set 2025",
        tempoLeitura: "8 min"
    },
    {
        id: 6,
        titulo: "Planejamento Tributário para Pequenas Empresas: Economize Legalmente",
        categoria: "Direito Tributário",
        imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Estratégias legais para reduzir a carga tributária",
        resumo: "O planejamento tributário é fundamental para a saúde financeira das empresas. Conheça as principais estratégias legais para otimizar o pagamento de impostos.",
        conteudo: "O planejamento tributário é o conjunto de estratégias legais utilizadas para reduzir ou postergar o pagamento de tributos, sempre dentro dos limites da lei. Para pequenas empresas, essa prática é essencial para manter a competitividade.\n\nAs principais modalidades de tributação no Brasil são: Simples Nacional (para empresas com faturamento até R$ 4,8 milhões), Lucro Presumido (presunção de lucro baseada na atividade), e Lucro Real (baseado no lucro efetivo da empresa).\n\nO Simples Nacional geralmente é mais vantajoso para pequenas empresas, unificando vários impostos em uma única guia com alíquotas reduzidas. Porém, algumas atividades são vedadas e há limites de faturamento.\n\nOutras estratégias incluem: aproveitamento de créditos tributários, escolha adequada da atividade principal, organização societária eficiente, e uso de incentivos fiscais disponíveis.\n\nÉ fundamental contar com assessoria contábil e jurídica especializada, pois o planejamento inadequado pode configurar elisão fiscal ilegal, sujeita a multas e sanções. A economia deve sempre respeitar os princípios legais.",
        palavrasChave: ["planejamento tributário", "Simples Nacional", "Lucro Presumido", "impostos", "pequena empresa", "elisão fiscal"],
        dataPublicacao: "08 Set 2025",
        tempoLeitura: "11 min"
    },
    {
        id: 7,
        titulo: "Aposentadoria por Tempo de Contribuição: Novas Regras Pós-Reforma",
        categoria: "Direito Previdenciário",
        imagem: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Como a EC 103/2019 mudou as regras previdenciárias",
        resumo: "A Reforma da Previdência alterou significativamente as regras para aposentadoria. Entenda as novas exigências e as regras de transição que podem beneficiá-lo.",
        conteudo: "A Emenda Constitucional 103/2019 (Reforma da Previdência) estabeleceu novas regras para a aposentadoria no Brasil. A principal mudança foi a criação da idade mínima para aposentadoria: 62 anos para mulheres e 65 anos para homens, além de 15 anos de contribuição.\n\nPara quem já contribuía antes da reforma, existem regras de transição mais benéficas: Regra dos Pontos (soma da idade + tempo de contribuição), Regra da Idade Progressiva, Regra do Pedágio 50%, e Regra do Pedágio 100%.\n\nA Regra dos Pontos exige 87 pontos para mulheres e 97 para homens em 2025, com aumento gradual até 100 e 105 pontos, respectivamente. O tempo mínimo de contribuição permanece 30 anos (mulher) e 35 anos (homem).\n\nO cálculo do benefício também mudou. A nova fórmula considera 60% da média de todos os salários de contribuição, mais 2% por ano que exceder 15 anos de contribuição (mulher) ou 20 anos (homem).\n\nÉ recomendável fazer um planejamento previdenciário para escolher a melhor regra para seu caso específico.",
        palavrasChave: ["aposentadoria", "Reforma da Previdência", "regras de transição", "tempo de contribuição", "idade mínima", "INSS"],
        dataPublicacao: "14 Set 2025",
        tempoLeitura: "12 min"
    },
    {
        id: 8,
        titulo: "Licitações Públicas: Guia Completo para Fornecedores",
        categoria: "Direito Administrativo",
        imagem: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Como participar de processos licitatórios com segurança",
        resumo: "As licitações são oportunidades de negócio com o poder público. Conheça os tipos de licitação, documentação necessária e como evitar armadilhas jurídicas.",
        conteudo: "A licitação é o procedimento administrativo pelo qual a Administração Pública seleciona a proposta mais vantajosa para contratação de obras, serviços, compras e alienações. A Lei 14.133/2021 (Nova Lei de Licitações) modernizou os procedimentos.\n\nAs principais modalidades são: Pregão (bens e serviços comuns), Concorrência (contratos de alto valor), Tomada de Preços (valor intermediário), Convite (menor valor), e Diálogo Competitivo (soluções inovadoras).\n\nPara participar, a empresa deve atender aos requisitos de habilitação: regularidade fiscal, qualificação técnica, qualificação econômico-financeira, e regularidade jurídica. A documentação deve estar sempre atualizada.\n\nA fase de habilitação precede a análise das propostas. Empresas inabilitadas não têm suas propostas analisadas. É fundamental verificar se a empresa atende todos os requisitos antes de participar.\n\nCuidados importantes: ler atentamente o edital, calcular corretamente os custos, verificar prazos, e acompanhar possíveis impugnações. Em caso de irregularidades, é possível apresentar recursos administrativos nos prazos legais.",
        palavrasChave: ["licitação", "pregão", "habilitação", "edital", "proposta", "Administração Pública"],
        dataPublicacao: "07 Set 2025",
        tempoLeitura: "13 min"
    },
    {
        id: 9,
        titulo: "Sociedades Empresárias: LTDA vs. SA - Qual Escolher?",
        categoria: "Direito Empresarial",
        imagem: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Comparativo detalhado entre os tipos societários mais comuns",
        resumo: "A escolha do tipo societário impacta diretamente na gestão, tributação e responsabilidade dos sócios. Entenda as diferenças entre LTDA e SA para fazer a melhor escolha.",
        conteudo: "A escolha do tipo societário é uma das decisões mais importantes na constituição de uma empresa. No Brasil, os tipos mais comuns são a Sociedade Limitada (LTDA) e a Sociedade Anônima (SA), cada uma com características específicas.\n\nNa LTDA, a responsabilidade dos sócios é limitada ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social. É mais flexível na gestão e tem menos formalidades. O capital é dividido em quotas, e a administração pode ser exercida por sócios ou terceiros.\n\nA SA tem o capital dividido em ações e pode ser aberta (negocia ações na bolsa) ou fechada. A responsabilidade dos acionistas é limitada ao preço das ações subscritas. Possui estrutura mais rígida, com obrigatoriedade de conselho de administração em algumas situações.\n\nA LTDA é mais adequada para empresas familiares ou com poucos sócios, enquanto a SA é preferível quando há necessidade de captar recursos no mercado ou quando se planeja abrir o capital.\n\nOutros fatores a considerar: custos de constituição e manutenção, formalidades legais, facilidade para entrada/saída de sócios, e aspectos tributários específicos de cada tipo.",
        palavrasChave: ["sociedade limitada", "sociedade anônima", "LTDA", "SA", "responsabilidade dos sócios", "capital social"],
        dataPublicacao: "06 Set 2025",
        tempoLeitura: "10 min"
    },
    {
        id: 10,
        titulo: "Alienação Parental: Identificação e Medidas Legais",
        categoria: "Direito de Família",
        imagem: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Como reconhecer e combater a alienação parental",
        resumo: "A alienação parental é uma forma grave de violência psicológica contra crianças. A Lei 12.318/2010 estabelece medidas para coibir essa prática e proteger os menores.",
        conteudo: "A alienação parental é definida pela Lei 12.318/2010 como a interferência na formação psicológica da criança ou adolescente, promovida por um genitor contra o outro, que pode causar repúdio injustificado ou prejuízo ao estabelecimento ou manutenção de vínculos.\n\nSinais de alienação incluem: campanha denegritória contra um dos genitores, resistência ou recusa da criança em conviver com o genitor alienado, ausência de culpa por comportamentos cruéis, apoio ao genitor alienador em conflitos, animosidade contra familiares do genitor alienado.\n\nAs consequências para a criança podem ser graves: baixa autoestima, depressão, ansiedade, dificuldades de relacionamento, e problemas de identidade. Por isso, a intervenção judicial é fundamental.\n\nMedidas previstas na lei incluem: advertência ao alienador, ampliação do regime de convivência em favor do genitor alienado, multa ou determinação de acompanhamento psicológico, alteração da guarda, e em casos extremos, suspensão da autoridade parental.\n\nÉ essencial buscar ajuda especializada imediatamente ao identificar sinais de alienação, pois quanto mais rápida a intervenção, maiores as chances de reversão dos danos causados à criança.",
        palavrasChave: ["alienação parental", "guarda compartilhada", "direitos da criança", "psicologia jurídica", "convivência familiar"],
        dataPublicacao: "05 Set 2025",
        tempoLeitura: "9 min"
    },
    {
        id: 11,
        titulo: "Legítima Defesa: Limites e Consequências Jurídicas",
        categoria: "Direito Penal",
        imagem: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Quando a legítima defesa é reconhecida pela lei",
        resumo: "A legítima defesa é um direito fundamental, mas tem limites específicos. Entenda quando é possível invocá-la e quais são os requisitos legais para sua caracterização.",
        conteudo: "A legítima defesa está prevista no artigo 25 do Código Penal e exclui a ilicitude do fato quando o agente repele injusta agressão, atual ou iminente, a direito seu ou de outrem, usando moderadamente os meios necessários.\n\nOs requisitos para caracterização são: agressão injusta (contrária ao direito), atual ou iminente (presente ou prestes a ocorrer), contra direito próprio ou alheio (qualquer bem jurídico protegido), repulsão através de meios necessários (não havia outra forma), e moderação (proporcionalidade entre ataque e defesa).\n\nA agressão deve ser humana e consciente. Não há legítima defesa contra atos de animais, forças da natureza, ou pessoas em estado de inconsciência. A iminência significa que o ataque está prestes a ocorrer, não podendo ser remoto ou já consumado.\n\nA moderação é crucial: o meio escolhido deve ser o menos lesivo possível entre os disponíveis e suficientes para repelir a agressão. O excesso na legítima defesa pode ser doloso (intencional) ou culposo (por erro de cálculo), com consequências jurídicas distintas.\n\nÉ importante comprovar todos os requisitos através de provas testemunhais, periciais ou documentais para que a legítima defesa seja reconhecida.",
        palavrasChave: ["legítima defesa", "Código Penal", "agressão injusta", "moderação", "proporcionalidade", "excludente de ilicitude"],
        dataPublicacao: "04 Set 2025",
        tempoLeitura: "8 min"
    },
    {
        id: 12,
        titulo: "Terceirização de Serviços: Marco Legal e Direitos dos Trabalhadores",
        categoria: "Direito Trabalhista",
        imagem: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        subTitulo: "Lei 13.429/2017 e os novos paradigmas da terceirização",
        resumo: "A Lei da Terceirização ampliou as possibilidades de terceirização no Brasil. Conheça as regras, direitos dos trabalhadores terceirizados e responsabilidades das empresas.",
        conteudo: "A Lei 13.429/2017 regulamentou amplamente a terceirização no Brasil, permitindo que empresas terceirizem tanto atividades-meio quanto atividades-fim, desde que observados os requisitos legais.\n\nA empresa prestadora de serviços deve ter objeto social compatível com os serviços prestados e capital mínimo proporcional ao número de empregados. É vedada a terceirização para a própria empresa contratante ou empresas do mesmo grupo econômico.\n\nOs trabalhadores terceirizados têm direito a condições de trabalho equivalentes às dos empregados da contratante quando trabalharem em suas dependências: alimentação, atendimento médico, transporte, treinamento e outros benefícios oferecidos aos empregados diretos.\n\nA responsabilidade trabalhista é da empresa prestadora, mas a contratante responde subsidiariamente por eventuais débitos trabalhistas. Por isso, é fundamental verificar a idoneidade da empresa terceirizada e manter fiscalização constante.\n\nQuarteirização (subcontratação pela terceirizada) é vedada, exceto em casos específicos previstos em lei. O descumprimento das regras pode acarretar responsabilização solidária e multas administrativas.",
        palavrasChave: ["terceirização", "Lei 13.429", "responsabilidade subsidiária", "atividade-fim", "condições de trabalho", "quarteirização"],
        dataPublicacao: "03 Set 2025",
        tempoLeitura: "11 min"
    }
];

export type { Content };
