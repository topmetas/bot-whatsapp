const express = require('express');
const fs = require('fs');
const path = require('path');
const delay = require('../utils/delay');

const router = express.Router();
let clientRef = null;
let ioRef = null;
let isClientReady = false;
const enviados = new Set();

// 🔹 Função para salvar log e emitir via WebSocket
function registrarEnvio(grupo, mensagem) {
  const logPath = path.join(__dirname, '../logs/mensagens_log.txt');
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

// 🔹 Rota principal: Envia mensagens em lotes de 5 grupos
router.post('/', async (req, res) => {
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
    console.log(`📦 Grupos restantes: ${gruposRestantes.length}`);
    console.log('📋 Nomes dos grupos:', gruposRestantes.map(g => g.name));

    const logs = [];

    // Enviar em lotes de 5 grupos por vez
    while (gruposRestantes.length > 0) {
      const lote = gruposRestantes.splice(0, 5); // Próximos 5 grupos

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

          await delay(30000); // ⏱️ Delay de 30s entre CADA mensagem
        }

        enviados.add(grupo.name); // Marca como já enviado
      }
    }

    res.json({ status: '✅ Mensagens enviadas para todos os grupos!', logs });

  } catch (error) {
    console.error('❌ Erro ao enviar mensagens:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagens.' });
  }
});

// 🔹 Rota auxiliar para listar os grupos conectados
router.get('/grupos', async (req, res) => {
  if (!clientRef || !isClientReady) {
    return res.status(503).json({ error: 'WhatsApp ainda não está pronto.' });
  }

  try {
    const chats = await clientRef.getChats();
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

// 🔹 Injetores de dependência (para client, socket e status)
function setClient(clientInstance) {
  clientRef = clientInstance;
}

function setIO(ioInstance) {
  ioRef = ioInstance;
}

function setClientReady(value) {
  isClientReady = value;
}

module.exports = {
  router,
  setClient,
  setIO,
  setClientReady
};




