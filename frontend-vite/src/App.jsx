import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from './socket';

import './App.css';
import QRCodeDisplay from './components/QRCodeDisplay';
import StatusWhatsApp from './components/StatusWhatsApp';
import EnvioMensagens from './components/EnvioMensagens';
import LogsPainel from './components/LogsPainel';

export default function App() {
  const [mensagens, setMensagens] = useState(['']);
  const [logs, setLogs] = useState([]);
  const [whatsStatus, setWhatsStatus] = useState('🔄 Aguardando conexão com o WhatsApp...');

  useEffect(() => {
    socket.on('ready', (msg) => setWhatsStatus(msg));
    socket.on('mensagem_enviada', (data) => {
      const linha = `${new Date().toLocaleTimeString()} | ${data.status} | ${data.grupo || ''} - ${data.mensagem || ''}`;
      setLogs(prev => [linha, ...prev]);
    });

    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:3001/logs');
        setLogs(res.data.reverse());
      } catch (err) {
        console.error('Erro ao buscar logs:', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);

    return () => {
      clearInterval(interval);
      socket.off('ready');
      socket.off('mensagem_enviada');
    };
  }, []);

  const adicionarMensagem = () => {
    setMensagens([...mensagens, '']);
  };

  const handleMensagemChange = (index, value) => {
    const novas = [...mensagens];
    novas[index] = value;
    setMensagens(novas);
  };

  const enviar = async () => {
    try {
      const mensagensValidas = mensagens.filter(msg => msg.trim() !== '');
      if (mensagensValidas.length === 0) {
        alert('Adicione pelo menos uma mensagem!');
        return;
      }

      const res = await axios.post('http://localhost:3001/send-messages', {
        mensagens: mensagensValidas,
      });

      alert('✅ Envio iniciado!');
      if (res.data.logs) {
        setLogs(prev => [...res.data.logs.reverse(), ...prev]);
      }
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('❌ Erro ao enviar mensagens.');
    }
  };

  return (
    <div className="container" style={{ padding: 30, fontFamily: 'sans-serif' }}>
      <h1>📲 Bot de Mensagens WhatsApp</h1>
      <QRCodeDisplay />
      <StatusWhatsApp status={whatsStatus} />
      <EnvioMensagens
        mensagens={mensagens}
        adicionarMensagem={adicionarMensagem}
        handleMensagemChange={handleMensagemChange}
        enviar={enviar}
      />
      <LogsPainel logs={logs} />
    </div>
  );
}









