# Biblioteca Jurídica - Imagens Necessárias

## Estrutura de Imagens

Para que a Biblioteca Jurídica funcione corretamente, você precisa adicionar as seguintes imagens na pasta `public/juridico/`:

### Direito do Consumidor
- `consumidor1.jpg` - Imagem representativa de direitos do consumidor

### Direito de Família
- `familia1.jpg` - Imagem sobre divórcio
- `familia2.jpg` - Imagem sobre alienação parental

### Direito Penal
- `cyber1.jpg` - Imagem sobre crimes cibernéticos
- `penal1.jpg` - Imagem sobre legítima defesa

### Direito Trabalhista
- `trabalho1.jpg` - Imagem sobre rescisão trabalhista
- `trabalho2.jpg` - Imagem sobre terceirização

### Direito Civil
- `contrato1.jpg` - Imagem sobre contratos

### Direito Tributário
- `tributario1.jpg` - Imagem sobre planejamento tributário

### Direito Previdenciário
- `previdencia1.jpg` - Imagem sobre aposentadoria

### Direito Administrativo
- `licitacao1.jpg` - Imagem sobre licitações

### Direito Empresarial
- `empresa1.jpg` - Imagem sobre sociedades empresárias

## Sugestões de Fontes para Imagens

### Gratuitas:
- **Unsplash** (unsplash.com) - Busque por termos como: "law", "justice", "contract", "legal", "courthouse"
- **Pexels** (pexels.com) - Boa seleção de imagens jurídicas
- **Pixabay** (pixabay.com) - Imagens livres de direitos autorais

### Palavras-chave recomendadas:
- justice, law, legal, contract, gavel, courthouse, scales
- business law, family law, criminal law
- lawyer, attorney, legal advice, legal document

## Dimensões Recomendadas

- **Resolução**: 1200x800px ou superior
- **Formato**: JPG ou PNG
- **Proporção**: 3:2 (paisagem)
- **Tamanho**: Entre 100KB - 500KB (otimizado para web)

## Processamento de Imagens

O Next.js irá otimizar automaticamente as imagens através do componente `<Image />`. As imagens serão:
- Redimensionadas automaticamente
- Convertidas para formatos modernos (WebP)
- Carregadas sob demanda (lazy loading)
- Responsivas para diferentes tamanhos de tela

## Fallback

Caso alguma imagem não seja encontrada, você pode adicionar imagens de placeholder ou usar um serviço como:
- `https://via.placeholder.com/1200x800/667eea/ffffff?text=Direito+Civil`
- `https://picsum.photos/1200/800` (imagens aleatórias)

## Estrutura Final da Pasta

```
public/
└── juridico/
    ├── consumidor1.jpg
    ├── familia1.jpg
    ├── familia2.jpg
    ├── cyber1.jpg
    ├── penal1.jpg
    ├── trabalho1.jpg
    ├── trabalho2.jpg
    ├── contrato1.jpg
    ├── tributario1.jpg
    ├── previdencia1.jpg
    ├── licitacao1.jpg
    └── empresa1.jpg
```
