# 📅 Agenda Completa - Sistema Avoccus

Uma agenda completa e moderna com notificações automáticas por e-mail, sistema de cores, filtros e muito mais.

## ✨ Funcionalidades

### 🗓️ **Calendário Interativo**
- Visualização mensal com indicadores de eventos
- Navegação fácil entre datas
- Destaque visual para hoje e amanhã
- Indicadores visuais para dias com eventos

### 📝 **Gerenciamento de Eventos**
- **Criação completa de eventos** com:
  - Título e descrição detalhada
  - Data e horário de início/fim
  - Tipo de evento (Audiência, Reunião, Prazo, Outro)
  - Status (Pendente, Confirmado, Concluído, Cancelado)
  - Localização
  - Sistema de cores personalizáveis
  - Configuração de lembretes

### 🎨 **Sistema de Cores**
- **10 cores disponíveis** para categorizar eventos:
  - 🔵 Azul - Eventos gerais
  - 🟢 Verde - Reuniões
  - 🟡 Amarelo - Lembretes
  - 🔴 Vermelho - Urgente/Prazos
  - 🟣 Roxo - Audiências
  - 🩷 Rosa - Eventos pessoais
  - 🔵 Ciano - Consultas
  - 🟠 Laranja - Deadlines
  - ⚫ Cinza - Cancelados
  - 🟦 Índigo - Importantes

### 📧 **Notificações Automáticas**
- **E-mail automático** enviado antes dos eventos
- Configuração personalizável do tempo de antecedência:
  - 15 minutos, 30 minutos, 1 hora
  - 4 horas, 1 dia, 2 dias
- Sistema inteligente que evita spam
- Verificação automática a cada hora

### 📊 **Visualizações Organizadas**
- **4 abas principais**:
  1. **Calendário** - Visão mensal tradicional
  2. **Próximos** - Eventos dos próximos 7 dias
  3. **Passados** - Histórico dos últimos 7 dias
  4. **Todos** - Lista completa com filtros

### 🏷️ **Status e Indicadores Visuais**
- **Eventos de hoje**: Borda azul destacada
- **Eventos de amanhã**: Borda amarela
- **Eventos passados**: Opacidade reduzida
- **Ícones de status**:
  - ✅ Confirmado
  - 🕐 Pendente
  - ❌ Cancelado

### 🔔 **Alertas e Lembretes**
- Notificação visual para eventos próximos
- Contador de eventos por categoria
- Sistema de badges informativos

## 🚀 Como Usar

### 1. **Criando um Novo Evento**
1. Clique no botão **"Novo Evento"**
2. Preencha as informações:
   - Título (obrigatório)
   - Descrição (opcional)
   - Tipo e status
   - Escolha uma cor
   - Defina horários
   - Configure notificações
3. Clique em **"Salvar"**

### 2. **Editando Eventos**
- Clique em qualquer evento para editá-lo
- Todas as informações podem ser modificadas
- As alterações são salvas automaticamente

### 3. **Navegando pela Agenda**
- **Calendário**: Clique em qualquer data para ver eventos
- **Próximos**: Veja o que está chegando
- **Passados**: Revise eventos anteriores
- **Todos**: Visão geral completa

### 4. **Configurando Notificações**
1. Ao criar/editar um evento, marque "Notificar por e-mail"
2. Escolha quando ser lembrado (ex: 1 dia antes)
3. O sistema enviará automaticamente o lembrete

### 5. **Verificação Manual de Notificações**
- Clique no botão **"Notificar"** (🔔) no header
- Força o envio de notificações pendentes

## ⚙️ Configuração Técnica

### **Estrutura de Arquivos**
```
src/
├── components/agenda/
│   ├── AgendaCompleta.tsx      # Componente principal
│   └── calendario.tsx          # Export da agenda
├── types/entities/
│   └── Evento.ts              # Tipos e interfaces
├── store/
│   └── useAgendaStore.ts      # Estado global
├── services/
│   └── notificacaoService.ts  # Serviço de e-mails
├── hooks/
│   └── useNotificacoes.ts     # Hook de notificações
├── styles/
│   └── agenda.css             # Estilos específicos
└── pages/api/agenda/
    └── notificacao-email.ts   # API de e-mail
```

### **Dependências Utilizadas**
- `zustand` - Gerenciamento de estado
- `date-fns` - Manipulação de datas
- `react-day-picker` - Componente de calendário
- `lucide-react` - Ícones modernos
- `@radix-ui` - Componentes UI acessíveis

### **Configuração de E-mail**
Para habilitar o envio real de e-mails, configure um serviço:

1. **Opção 1: Nodemailer + SMTP**
```bash
npm install nodemailer @types/nodemailer
```

2. **Opção 2: SendGrid**
```bash
npm install @sendgrid/mail
```

3. **Opção 3: Resend (Recomendado)**
```bash
npm install resend
```

4. Configure as variáveis de ambiente no `.env.local`

### **Armazenamento**
- Os eventos são salvos no **localStorage** com Zustand persist
- Sincronização automática entre abas
- Dados persistem entre sessões

## 🎯 Funcionalidades Avançadas

### **Filtros Inteligentes**
- Filtrar por tipo de evento
- Filtrar por status
- Filtrar por cor
- Filtrar por período

### **Importação/Exportação**
- Exportar eventos para calendário (.ics)
- Importar de outros sistemas
- Backup automático dos dados

### **Integração com Calendários**
- Google Calendar
- Outlook
- Apple Calendar

### **Relatórios**
- Relatório mensal de atividades
- Estatísticas de produtividade
- Análise de padrões

## 🔧 Personalização

### **Cores Customizadas**
Edite `EventoCor` em `types/entities/Evento.ts` para adicionar novas cores:

```typescript
export enum EventoCor {
  // Cores existentes...
  NOVA_COR = '#FF6B6B',
}
```

### **Tipos de Evento**
Adicione novos tipos em `EventoTipo`:

```typescript
export enum EventoTipo {
  // Tipos existentes...
  CONSULTA = 'CONSULTA',
  VENCIMENTO = 'VENCIMENTO',
}
```

### **Intervalos de Notificação**
Modifique as opções no componente `AgendaCompleta.tsx`:

```typescript
<SelectItem value="7200">2 horas</SelectItem>
<SelectItem value="10080">1 semana</SelectItem>
```

## 🌟 Melhorias Futuras

- [ ] **Push notifications** no navegador
- [ ] **Sincronização em nuvem** (Firebase/Supabase)
- [ ] **Convites para eventos** com outros usuários
- [ ] **Eventos recorrentes** (diário, semanal, mensal)
- [ ] **Anexos de arquivos** nos eventos
- [ ] **Zoom/Google Meet** integration
- [ ] **Tema dark/light** personalizado
- [ ] **Importação de feriados** brasileiros
- [ ] **Widget de agenda** para dashboard
- [ ] **Aplicativo mobile** (React Native)

## 🐛 Resolução de Problemas

### **Eventos não aparecem**
1. Verifique se a data está correta
2. Limpe o localStorage: `localStorage.clear()`
3. Recarregue a página

### **Notificações não funcionam**
1. Verifique a configuração do serviço de e-mail
2. Confirme se o evento tem "Notificar por e-mail" ativado
3. Verifique o console para erros

### **Calendário não carrega**
1. Verifique se todos os componentes UI estão instalados
2. Confirme se o CSS está sendo importado
3. Verifique erros no console do navegador

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este README primeiro
2. Consulte os logs do console
3. Entre em contato com a equipe de desenvolvimento

**Feito com ❤️ para o sistema Avoccus**
