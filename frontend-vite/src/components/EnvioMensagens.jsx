import { useState } from 'react';
import axios from 'axios';

export default function EnvioMensagens({ onNewLogs }) {
  const [mensagens, setMensagens] = useState(['']);

  const adicionarMensagem = () => setMensagens([...mensagens, '']);

  const handleMensagemChange = (index, value) => {
    const novas = [...mensagens];
    novas[index] = value;
    setMensagens(novas);
  };

  const enviar = async () => {
    try {
      const res = await axios.post('http://localhost:3001/send-messages', {
        mensagens: mensagens.filter(msg => msg.trim() !== '')
      });

      alert('✅ Mensagens enviadas com sucesso!');
      onNewLogs(res.data.logs.reverse());
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('❌ Erro ao enviar mensagens.');
    }
  };

  return (
    <div>
      <h3>Mensagens a Enviar</h3>
      <p>📌 As mensagens serão enviadas automaticamente para grupos em lotes de 5 (sem repetições).</p>

      {mensagens.map((msg, i) => (
        <textarea
          key={i}
          value={msg}
          onChange={(e) => handleMensagemChange(i, e.target.value)}
          rows="3"
          style={{ width: '100%', marginBottom: 10 }}
          placeholder={`Mensagem ${i + 1}`}
        />
      ))}

      <button onClick={adicionarMensagem}>➕ Adicionar Mensagem</button>
      <br /><br />
      <button onClick={enviar}>🚀 Enviar Mensagens</button>
    </div>
  );
}


