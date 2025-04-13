import { useEffect, useState } from 'react';
import socket from '../socket';

export default function QRCodeDisplay() {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    socket.on('qr', setQrCode);
    return () => socket.off('qr');
  }, []);

  if (!qrCode) return null;

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>📷 Escaneie o QR Code com o WhatsApp</h3>
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`}
        alt="QR Code"
        style={{ border: '1px solid #ccc', padding: 10 }}
      />
    </div>
  );
}

