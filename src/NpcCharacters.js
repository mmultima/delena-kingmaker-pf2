import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NpcCharacters() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;
  const [npcCharacters, setNpcCharacters] = useState([]);

  useEffect(() => {
    fetch(charactersEndpoint)
        .then(res => res.json())
        .then(data => setNpcCharacters(data.filter(c => c.npc && !c.companion)))
        .catch(() => setNpcCharacters([]));
  }, [charactersEndpoint]);

  return (
    <div>
      <h2>NPC Characters</h2>
      <ul>
        {npcCharacters.length === 0 && <li>No NPCs found.</li>}
        {npcCharacters.map(char => (
          <li key={char.id}>
            <Link to={`/character/${char.id}`}>
              {char.name} {char.class ? `- ${char.class}` : ''}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/" style={{ display: 'block', marginTop: '1em' }}>
        Back to Home
      </Link>
    </div>
  );
}