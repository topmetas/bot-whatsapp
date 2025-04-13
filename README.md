# 📱 WhatsApp API com Node.js e whatsapp-web.js

Projeto backend para envio de mensagens automatizadas para grupos do WhatsApp via API REST, utilizando a biblioteca `whatsapp-web.js`.

---

## 🚀 Funcionalidades

- Conexão com WhatsApp via QR Code
- Envio de mensagens para múltiplos grupos
- Suporte a múltiplas mensagens por grupo
- Log de envio salvo em arquivo (`/logs/mensagens_log.txt`)
- Delay automático entre envios (30s)
- Estrutura organizada por rotas e módulos

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- whatsapp-web.js
- Puppeteer
- dotenv
- qrcode-terminal
- fs / path
- axios
- moment
- nodemon
- socket.io
---

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/whatsapp-api-node.git
cd whatsapp-api-node
