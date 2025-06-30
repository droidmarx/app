# IndaiaFibra App 🌐

Uma aplicação web progressiva (PWA) moderna e completa para gerenciamento de instalações e manutenções de fibra óptica, desenvolvida especificamente para técnicos de campo.

## 🚀 Características Principais

### 📱 **Aplicação Web Progressiva (PWA)**
- **Instalação nativa**: Pode ser instalada como um aplicativo nativo em dispositivos móveis e desktop
- **Modo offline completo**: Funciona perfeitamente sem conexão à internet
- **Sincronização automática**: Dados são sincronizados quando a conexão é restaurada
- **Notificações push**: Receba lembretes e alertas importantes
- **Ícones e splash screen**: Experiência visual completa como um app nativo

### 🎨 **Design Moderno e Responsivo**
- **Glass morphism**: Efeitos visuais modernos com transparência e blur
- **Modo escuro automático**: Detecta preferência do sistema e permite alternância manual
- **Micro-interações**: Animações suaves e feedback visual em todas as interações
- **Mobile-first**: Otimizado prioritariamente para dispositivos móveis
- **Tipografia otimizada**: Hierarquia visual clara e legibilidade aprimorada

### 📸 **Captura e Gerenciamento de Fotos**
- **Acesso à câmera**: Captura fotos diretamente pelo dispositivo
- **Múltiplas fotos**: Suporte para várias fotos por instalação/manutenção
- **Compressão automática**: Otimização de tamanho para melhor performance
- **Preview das fotos**: Visualização antes do envio
- **Armazenamento local**: Fotos salvas no IndexedDB para acesso offline

### 🔍 **Scanner de QR Code e Código de Barras**
- **Scanner integrado**: Leitor de QR Code via câmera do dispositivo
- **Preenchimento automático**: Dados do QR preenchem campos automaticamente
- **Múltiplos formatos**: Suporte para QR Code, Code 128, EAN-13
- **Interface intuitiva**: Scanner com overlay visual para melhor usabilidade
- **Validação de dados**: Verificação automática do formato dos códigos

### 📊 **Relatórios e Análises**
- **Gráficos interativos**: Visualizações com Chart.js
- **Instalações por período**: Acompanhamento de produtividade
- **Materiais mais utilizados**: Análise de consumo de materiais
- **Estatísticas gerais**: Contadores de instalações e manutenções
- **Exportação de dados**: Possibilidade de exportar relatórios

### 🔔 **Notificações e Lembretes**
- **Push notifications**: Notificações nativas do navegador
- **Lembretes inteligentes**: Baseados em estoque baixo e agendamentos
- **Feedback de ações**: Confirmação visual e tátil para todas as operações
- **Configuração personalizada**: Controle total sobre tipos de notificação

### 🎯 **Experiência do Usuário Aprimorada**
- **Gestos de navegação**: Swipe para navegar entre abas
- **Feedback tátil**: Vibração sutil em interações importantes
- **Validação em tempo real**: Feedback instantâneo durante preenchimento
- **Personalização completa**: Cores, densidade da interface e preferências
- **Acessibilidade**: Suporte completo a leitores de tela e navegação por teclado

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Animações, flexbox, grid, custom properties
- **JavaScript ES6+**: Funcionalidades modernas e programação assíncrona
- **Service Worker**: Cache inteligente e funcionalidade offline
- **IndexedDB**: Banco de dados local robusto

### **Bibliotecas e APIs**
- **Chart.js**: Gráficos interativos e responsivos
- **Leaflet**: Mapas interativos e leves
- **HTML5-QRCode**: Leitura de códigos QR e barras
- **Font Awesome**: Iconografia consistente e moderna
- **AOS (Animate On Scroll)**: Animações suaves de entrada

### **APIs Web Utilizadas**
- **Geolocation API**: Localização automática do usuário
- **Camera API**: Acesso à câmera para captura de fotos
- **Vibration API**: Feedback tátil em dispositivos suportados
- **Notification API**: Notificações push nativas
- **Nominatim API**: Geocodificação de endereços

## 📋 Funcionalidades Detalhadas

### **Gestão de Instalações**
- Formulário completo para nova instalação
- Seleção de técnico responsável
- Informações do cliente e localização
- Configuração de CTO e porta
- Medição de sinal (CTO e cliente)
- Seleção inteligente de materiais
- Captura de fotos da instalação
- Localização via GPS ou busca de endereço
- Envio automático para Telegram

### **Gestão de Manutenções**
- Formulário específico para manutenções
- Descrição detalhada do problema
- Solução aplicada
- Materiais utilizados na correção
- Documentação fotográfica
- Localização do atendimento
- Histórico completo de manutenções

### **Controle de Materiais**
- Cadastro de novos materiais
- Controle de estoque em tempo real
- Seleção automática baseada em quantidade
- Edição inline de materiais
- Alertas de estoque baixo
- Histórico de uso de materiais

### **Histórico e Relatórios**
- Histórico completo de instalações e manutenções
- Filtros por tipo de trabalho
- Busca textual avançada
- Detalhes expandíveis de cada registro
- Localização no mapa para cada trabalho
- Exportação de dados
- Limpeza seletiva de histórico

### **Mapas e Localização**
- Mapa interativo para cada instalação/manutenção
- Busca de endereços com sugestões
- Localização automática via GPS
- Marcadores personalizados
- Integração com Google Maps
- Mapa geral de CTOs

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Navegador web moderno (Chrome 80+, Safari 13+, Firefox 75+, Edge 80+)
- Conexão à internet (apenas para primeira configuração)
- Dispositivo com câmera (para captura de fotos e QR codes)

### **Instalação**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/indaiafibra-app.git
   cd indaiafibra-app
   ```

2. **Configuração do Telegram:**
   - Abra o arquivo `script.js`
   - Localize a constante `TELEGRAM_GROUP_LINK`
   - Substitua pelo link do seu grupo do Telegram:
   ```javascript
   const TELEGRAM_GROUP_LINK = 'https://t.me/+SEU_LINK_DO_GRUPO_AQUI';
   ```

3. **Hospedagem:**
   - **Opção 1 - Servidor local:**
     ```bash
     # Com Python
     python -m http.server 8000
     
     # Com Node.js
     npx serve .
     
     # Com PHP
     php -S localhost:8000
     ```
   
   - **Opção 2 - GitHub Pages:**
     - Faça push dos arquivos para um repositório GitHub
     - Ative GitHub Pages nas configurações do repositório
     - Acesse via `https://seu-usuario.github.io/nome-do-repositorio`
   
   - **Opção 3 - Netlify/Vercel:**
     - Conecte seu repositório GitHub
     - Deploy automático a cada commit

4. **Instalação como PWA:**
   - Acesse a aplicação pelo navegador
   - Clique no ícone de "Instalar" na barra de endereços
   - Ou use o menu do navegador > "Instalar aplicativo"

### **Configuração Inicial**

1. **Materiais padrão:**
   - Acesse a aba "Materiais"
   - Cadastre os materiais utilizados pela sua equipe
   - Defina quantidades padrão para cada material

2. **Técnicos:**
   - Edite os arquivos HTML para incluir os técnicos da sua equipe
   - Localize as seções `<select>` com técnicos
   - Adicione ou remova opções conforme necessário

3. **Personalização:**
   - Acesse a aba "Configurações"
   - Personalize cores, densidade da interface
   - Configure notificações e feedback tátil
   - Ajuste preferências de tema

## 📱 Como Usar

### **Nova Instalação**

1. **Informações básicas:**
   - Selecione o tipo de trabalho
   - Escolha o técnico responsável
   - Informe o nome do cliente

2. **Configuração técnica:**
   - Digite o identificador da CTO
   - Selecione a porta utilizada
   - Ajuste os valores de sinal (CTO e cliente)

3. **Materiais:**
   - Selecione os materiais necessários
   - Ajuste as quantidades utilizadas
   - O sistema atualiza automaticamente o estoque

4. **Documentação:**
   - Capture fotos da instalação
   - Use o scanner QR se disponível
   - Confirme a localização no mapa

5. **Finalização:**
   - Revise todas as informações
   - Clique em "Enviar para Telegram"
   - O registro é salvo automaticamente no histórico

### **Nova Manutenção**

1. **Identificação:**
   - Selecione o técnico
   - Informe o cliente

2. **Descrição do problema:**
   - Descreva detalhadamente o problema encontrado
   - Explique a solução aplicada

3. **Recursos utilizados:**
   - Selecione materiais utilizados na correção
   - Capture fotos do antes e depois

4. **Localização:**
   - Confirme o endereço da manutenção
   - Use GPS ou busca manual

5. **Envio:**
   - Revise as informações
   - Envie para o grupo do Telegram

### **Gestão de Materiais**

1. **Adicionar material:**
   - Digite o nome do material
   - Defina a quantidade padrão
   - Clique em "Adicionar Material"

2. **Editar material:**
   - Clique no ícone de edição
   - Modifique nome ou quantidade
   - Salve as alterações

3. **Controle de estoque:**
   - O sistema atualiza automaticamente
   - Receba alertas de estoque baixo
   - Monitore uso através dos relatórios

### **Visualização de Relatórios**

1. **Estatísticas gerais:**
   - Visualize contadores de instalações e manutenções
   - Acompanhe produtividade da equipe

2. **Gráficos:**
   - Instalações por semana
   - Materiais mais utilizados
   - Tendências de crescimento

3. **Exportação:**
   - Exporte dados para análise externa
   - Gere relatórios personalizados

## 🔧 Configurações Avançadas

### **Personalização de Cores**
```css
:root {
  --primary-color: #1E40AF;    /* Cor principal */
  --secondary-color: #06B6D4;  /* Cor secundária */
  --accent-color: #8B5CF6;     /* Cor de destaque */
}
```

### **Configuração de Notificações**
```javascript
// Personalizar tipos de notificação
const notificationSettings = {
  stockAlerts: true,
  completionNotifications: true,
  reminderNotifications: true,
  errorNotifications: true
};
```

### **Ajuste de Performance**
```javascript
// Configurar cache e sincronização
const cacheSettings = {
  maxHistoryRecords: 100,
  photoCompressionQuality: 0.8,
  syncInterval: 300000 // 5 minutos
};
```

## 🌐 Compatibilidade

### **Navegadores Suportados**
- ✅ Chrome 80+ (Android/Desktop)
- ✅ Safari 13+ (iOS/macOS)
- ✅ Firefox 75+ (Android/Desktop)
- ✅ Edge 80+ (Windows/Android)
- ✅ Samsung Internet 12+

### **Dispositivos Testados**
- ✅ Smartphones Android (5.0+)
- ✅ iPhones (iOS 13+)
- ✅ Tablets Android/iPad
- ✅ Dispositivos com telas pequenas (320px+)

### **Funcionalidades por Plataforma**

| Funcionalidade | Android | iOS | Desktop |
|----------------|---------|-----|---------|
| Instalação PWA | ✅ | ✅ | ✅ |
| Modo Offline | ✅ | ✅ | ✅ |
| Captura de Foto | ✅ | ✅ | ✅ |
| Scanner QR | ✅ | ✅ | ✅ |
| Geolocalização | ✅ | ✅ | ✅ |
| Notificações Push | ✅ | ✅ | ✅ |
| Feedback Tátil | ✅ | ✅ | ❌ |
| Gestos (Swipe) | ✅ | ✅ | ❌ |

## 🔒 Segurança e Privacidade

### **Armazenamento de Dados**
- Todos os dados são armazenados localmente no dispositivo
- Utilização do IndexedDB para máxima segurança
- Nenhum dado é enviado para servidores externos (exceto Telegram)
- Backup automático local com criptografia

### **Permissões Necessárias**
- **Câmera**: Para captura de fotos e scanner QR
- **Localização**: Para marcação automática de endereços
- **Notificações**: Para lembretes e alertas
- **Armazenamento**: Para funcionamento offline

### **Política de Privacidade**
- Não coletamos dados pessoais
- Informações permanecem no dispositivo do usuário
- Integração com Telegram usa API pública
- Código fonte aberto para auditoria

## 🐛 Solução de Problemas

### **Problemas Comuns**

**1. App não instala como PWA**
- Verifique se está usando HTTPS
- Confirme se o manifest.json está acessível
- Teste em navegador suportado

**2. Câmera não funciona**
- Verifique permissões do navegador
- Teste em dispositivo com câmera
- Confirme se está usando HTTPS

**3. Modo offline não funciona**
- Verifique se Service Worker foi registrado
- Limpe cache do navegador
- Recarregue a aplicação

**4. Dados não sincronizam**
- Verifique conexão com internet
- Confirme se IndexedDB está funcionando
- Teste em navegador suportado

**5. Notificações não aparecem**
- Verifique permissões de notificação
- Confirme configurações do sistema
- Teste em dispositivo suportado

### **Debug e Logs**
```javascript
// Ativar logs detalhados
localStorage.setItem('debugMode', 'true');

// Verificar status do Service Worker
navigator.serviceWorker.getRegistrations().then(console.log);

// Verificar dados no IndexedDB
// Abra DevTools > Application > Storage > IndexedDB
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork o projeto**
2. **Crie uma branch para sua feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### **Diretrizes de Contribuição**
- Mantenha o código limpo e bem documentado
- Teste todas as funcionalidades antes do PR
- Siga os padrões de código existentes
- Atualize a documentação quando necessário

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **Equipe IndaiaFibra** - Por fornecer os requisitos e feedback
- **Comunidade Open Source** - Pelas bibliotecas utilizadas
- **Desenvolvedores Web** - Pelas APIs e padrões modernos

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Issues do GitHub**: Para bugs e solicitações de features
- **Documentação**: Consulte este README para informações detalhadas
- **Comunidade**: Participe das discussões no repositório

---

**Desenvolvido com ❤️ para a comunidade de técnicos em fibra óptica**

*IndaiaFibra App - Transformando a gestão de instalações e manutenções com tecnologia moderna e design intuitivo.*

