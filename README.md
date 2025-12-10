# 🤖 WhatsApp Automation Bot  
Automação completa para envio de mensagens em grupos e contatos do WhatsApp utilizando **Node.js**, **Express**, **whatsapp-web.js**, **Puppeteer** e **Frontend em Vite + React**.

Este projeto foi criado para permitir:
- Envio automático de mensagens programadas
- Envio manual instantâneo
- Busca automática de grupos e contatos
- Upload de listas
- Histórico de envios
- Gerenciamento via painel web

Ideal para empresas, suporte, automações internas, notificações e bots personalizados.

---

## 🚀 Funcionalidades

### 📌 1. Backend (Node.js + Express)
- Conexão com WhatsApp via **whatsapp-web.js**
- Leitura e envio de mensagens
- Captura automática de grupos e contatos
- Envio para:
  - Todos os grupos
  - Grupos filtrados por palavra-chave
  - Contatos individuais
  - Contatos filtrados
- Sistema de **fila de envio**
- Delay configurável (ex: 30 segundos)
- API organizada para integração com frontend
- Logs completos de mensagens enviadas

---

### 💻 2. Frontend (React + Vite)
- Interface limpa e responsiva
- Painel com:
  - Envio imediato
  - Agendamento
  - Filtros de grupos e contatos
  - Histórico completo
  - Status da sessão (QR Code / conectado)
  - Botão "Atualizar Logs"
- Contador e tempo estimado de envio
- Feedback visual com progresso

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- Node.js  
- Express.js  
- whatsapp-web.js  
- Puppeteer  
- Nodemon  
- Axios  
- Cors  

### **Frontend**
- React.js  
- Vite  
- TailwindCSS  
- Axios  
- React Router  

### **Outros**
- WebSockets  
- LocalStorage  
- JSON local como mini-database  

---

## 📦 Estrutura de Pastas

```bash
bot-whatsapp/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── utils/
│   │   └── session/
│   ├── package.json
│   └── .env.example
│
└── frontend-vite/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── hooks/
    ├── public/
    ├── vite.config.js
    └── package.json

⚙️ Como Rodar o Projeto
🔧 1. Clone o repositório
git clone https://github.com/topmetas/bot-whatsapp.git
cd bot-whatsapp

📡 Backend
➤ 2. Instale dependências
cd backend
npm install

➤ 3. Configure o ambiente

Crie um arquivo .env baseado no exemplo:

PORT=5000
SESSION_NAME=session-bot
DELAY=30000

➤ 4. Inicie o servidor
npm start


O servidor iniciará e exibirá o QR Code para autenticação.

🖥️ Frontend
➤ 1. Abra outra aba do terminal
cd frontend-vite
npm install
npm run dev


O painel ficará disponível em:

http://localhost:5173



🔐 Segurança

O projeto não salva senha ou dados pessoais.

A sessão do WhatsApp é criptografada pelo próprio WhatsApp.

Recomenda-se usar um número exclusivo para automações.

Variáveis sensíveis NUNCA devem ser commitadas — use .env.

📈 Possíveis Melhorias Futuras

Autenticação de usuários no painel web

Dashboard com gráficos (envios por dia, grupos mais ativos etc.)

Banco de dados real (MongoDB ou PostgreSQL)

Suporte a envio de mídia (imagens / PDF)

Multi-instância (vários números conectados ao mesmo painel)

🤝 Contribuição

Pull requests são bem-vindos.
Se quiser propor melhorias, abra uma Issue.

🧑‍💻 Desenvolvido por

Osvaldo Alves
Full Stack Developer – Node.js & React
GitHub: @topmetas

📄 Licença

Este projeto é de código aberto sob a licença MIT.
