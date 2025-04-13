const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use('/logs', express.static('logs')); // Servir arquivos de log estáticos

let clientRef = null;
let ioRef = io;
let isClientReady = false;
const enviados = new Set();

// 🔹 Função para salvar log e emitir via WebSocket
function registrarEnvio(grupo, mensagem) {
  const logPath = path.join(__dirname, './logs/mensagens_log.txt');
  const log = `${new Date().toISOString()} | Enviado para: ${grupo} | Mensagem: ${mensagem}\n`;
  fs.appendFileSync(logPath, log);

  if (ioRef) {
    ioRef.emit('mensagem_enviada', {
      grupo,
      mensagem,
      status: '✅ Enviado',
      timestamp: new Date().toISOString()
    });
  }
}

// 🔹 Rota GET /grupos - Listar grupos
app.get('/grupos', async (req, res) => {
  if (!clientRef || !isClientReady) {
    return res.status(503).json({ error: 'WhatsApp ainda não está pronto.' });
  }

  try {
    console.log("🔄 Buscando chats...");
    const chats = await clientRef.getChats();
    console.log("Chats recebidos:", chats);

    const grupos = chats
      .filter(c => c.isGroup)
      .map(g => ({
        id: g.id._serialized,
        nome: g.name
      }));

    res.json({ grupos });

  } catch (error) {
    console.error('❌ Erro ao listar grupos:', error);
    res.status(500).json({ error: 'Erro ao buscar grupos.' });
  }
});

// 🔹 Rota POST /send-messages - Enviar mensagens
app.post('/send-messages', async (req, res) => {
  const { mensagens } = req.body;

  console.log('📥 Requisição recebida com mensagens:', mensagens);

  if (!mensagens || !Array.isArray(mensagens) || mensagens.length === 0) {
    return res.status(400).json({ error: 'O campo "mensagens" (array) é obrigatório.' });
  }

  if (!clientRef || !isClientReady) {
    return res.status(503).json({ error: 'WhatsApp ainda não está pronto. Aguarde conexão.' });
  }

  try {
    const chats = await clientRef.getChats();
    const grupos = chats.filter(c => c.isGroup);
    const gruposRestantes = grupos.filter(g => !enviados.has(g.name));
    const logs = [];

    while (gruposRestantes.length > 0) {
      const lote = gruposRestantes.splice(0, 5);

      for (const grupo of lote) {
        for (const mensagem of mensagens.slice(0, 10)) {
          console.log(`📤 Enviando para ${grupo.name}: ${mensagem}`);
          await clientRef.sendMessage(grupo.id._serialized, mensagem);
          registrarEnvio(grupo.name, mensagem);
          logs.push(`✅ ${grupo.name}: "${mensagem}"`);

          if (ioRef) {
            ioRef.emit('status_envio', {
              grupo: grupo.name,
              mensagem,
              proximaMensagemEm: 30
            });
          }

          await delay(30000); // Delay de 30s por mensagem
        }

        enviados.add(grupo.name);
      }
    }

    res.json({ status: '✅ Mensagens enviadas para todos os grupos!', logs });

  } catch (error) {
    console.error('❌ Erro ao enviar mensagens:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagens.' });
  }
});

// 🔹 Inicializa o bot WhatsApp
function startBot() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', (qr) => {
    console.log('📸 Escaneie o QR code abaixo:');
    qrcode.generate(qr, { small: true });

    if (ioRef) {
      ioRef.emit('qr', qr);
    }
  });

  client.on('ready', () => {
    console.log('🤖 Bot conectado!');
    clientRef = client;
    isClientReady = true;

    if (ioRef) {
      ioRef.emit('ready', '🤖 Bot conectado com sucesso!');
    }
  });

  client.initialize();
}

startBot();

server.listen(3001, () => {
  console.log('🚀 Servidor rodando em http://localhost:3001');
});








