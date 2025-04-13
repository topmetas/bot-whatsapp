const enviados = new Set();

async function enviarMensagensPorLotes(client, mensagem, io) {
  const chats = await client.getChats();
  const grupos = chats.filter(c => c.isGroup);
  const naoEnviados = grupos.filter(g => !enviados.has(g.id._serialized));
  const lote = naoEnviados.slice(0, 5);

  for (const grupo of lote) {
    await client.sendMessage(grupo.id._serialized, mensagem);
    enviados.add(grupo.id._serialized);
    console.log(`✅ Enviado para ${grupo.name}`);
    io.emit('mensagem_enviada', {
      grupo: grupo.name,
      mensagem,
      status: '✅ Enviado'
    });
    await new Promise(res => setTimeout(res, 30000)); // Delay de 30s
  }

  if (naoEnviados.length > 5) {
    setTimeout(() => {
      enviarMensagensPorLotes(client, mensagem, io);
    }, 30000);
  } else {
    console.log("🏁 Todos os grupos receberam a mensagem!");
    io.emit('fim_envio', '🏁 Todos os grupos receberam a mensagem!');
  }
}

module.exports = enviarMensagensPorLotes;
