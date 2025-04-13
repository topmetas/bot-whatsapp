import { useEffect, useState } from 'react';
import socket from '../socket';

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('mensagem_enviada', (data) => {
      setLogs(prev => [...prev, data]);
    });
    return () => socket.off('mensagem_enviada');
  }, []);

  return (
    <div className="bg-gray-100 p-2 border rounded h-60 overflow-auto">
      {logs.map((log, index) => (
        <div key={index} className="text-sm">
          <b>{log.grupo}</b>: {log.mensagem} - {log.status}
        </div>
      ))}
    </div>
  );
}
