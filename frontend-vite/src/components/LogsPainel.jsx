import { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket';

export default function LogsPainel() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:3001/logs');
        setLogs(res.data.reverse());
      } catch (err) {
        console.error('Erro ao buscar logs:', err);
      }
    };

    fetchLogs();

    socket.on('mensagem_enviada', (data) => {
      setLogs(prev => [
        `${data.timestamp} | ${data.status} | ${data.grupo} - ${data.mensagem}`,
        ...prev
      ]);
    });

    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>📋 Logs:</h3>
      <div style={{ background: '#f4f4f4', padding: 10, height: 300, overflowY: 'scroll' }}>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

