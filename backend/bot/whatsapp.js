const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const manageGroups = require('../groupManager');
const sendInBatches = require('../messageScheduler');

function startBot(io, onReady) {
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    // 🔸 EMISSÃO DO QR VIA SOCKET
    client.on('qr', (qr) => {
        console.log('📸 Escaneie o QR code abaixo:');
        qrcode.generate(qr, { small: true });

        // 🔥 Envia para o frontend via Socket.IO
        if (io) {
            io.emit('qr', qr); // <- Agora seu componente React vai exibir!
        }
    });

    client.on('ready', async () => {
        console.log('🤖 Bot conectado!');
        const allGroups = await manageGroups(client);
        await sendInBatches(client, allGroups);

        if (io) {
            io.emit('ready', '🤖 Bot conectado com sucesso!');
        }

        if (onReady) onReady(client);
    });

    client.initialize();
}

module.exports = startBot;
