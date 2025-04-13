// backend/messageScheduler.js
module.exports = async function sendInBatches(client, mensagens) {
    const chats = await client.getChats();
    const grupos = chats.filter(chat => chat.isGroup);
  
    const enviados = new Set();
  
    for (let i = 0; i < grupos.length; i += 5) {
      const lote = grupos.slice(i, i + 5);
      
      for (const grupo of lote) {
        if (enviados.has(grupo.id._serialized)) continue;
        
        for (const msg of mensagens) {
          await grupo.sendMessage(msg);
        }
  
        enviados.add(grupo.id._serialized);
        console.log(`✅ Mensagens enviadas para grupo: ${grupo.name}`);
      }
  
      // Aguarda 30 segundos entre os lotes
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  };
  