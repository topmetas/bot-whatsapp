import { useState } from 'react';
import axios from 'axios';

export default function MessageForm({ selectedGroups }) {
  const [mensagem, setMensagem] = useState('');

  const enviar = async () => {
    if (!mensagem || selectedGroups.length === 0) return;
    await axios.post('http://localhost:3000/send', {
      grupos: selectedGroups,
      mensagem
    });
    setMensagem('');
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        value={mensagem}
        onChange={e => setMensagem(e.target.value)}
        placeholder="Digite a mensagem"
        className="flex-1 border px-2 py-1 rounded"
      />
      <button onClick={enviar} className="bg-green-600 text-white px-4 py-1 rounded">
        Enviar
      </button>
    </div>
  );
}
