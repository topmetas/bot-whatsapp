import { useState, useEffect } from 'react';
import axios from 'axios';

export default function GroupSelector({ selected, setSelected }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/groups').then(res => setGroups(res.data));
  }, []);

  const toggleGroup = (group) => {
    setSelected(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {groups.map(g => (
        <button
          key={g.name}
          onClick={() => toggleGroup(g.name)}
          className={`px-3 py-1 border rounded ${selected.includes(g.name) ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
