import { useEffect, useState } from 'react';
import socket from '../socket';

export default function StatusBar() {
  const [status, setStatus] = useState('⏳ Conectando...');

  useEffect(() => {
    socket.on('status', setStatus);
    return () => socket.off('status');
  }, []);

  return <div className="p-2 bg-gray-800 text-white text-sm">🔌 Status: {status}</div>;
}
