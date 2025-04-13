import { useEffect, useState } from 'react';
import socket from '../socket';

export default function StatusWhatsApp() {
  const [status, setStatus] = useState('🔄 Aguardando conexão com o WhatsApp...');

  useEffect(() => {
    socket.on('ready', (msg) => {
      setStatus(msg);
    });
  }, []);

  return (
    <p>Status do WhatsApp: <strong>{status}</strong></p>
  );
}

