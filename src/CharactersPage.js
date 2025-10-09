import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CharactersPage() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;

  const [npcCharacters, setNpcCharacters] = useState([]);
  const [pcCharacters, setPcCharacters] = useState([]);

  React.useEffect(() => {
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        setNpcCharacters(data.filter(char => char.npc));
        setPcCharacters(data.filter(char => !char.npc));
      })
      .catch(() => {
        setNpcCharacters([]);
        setPcCharacters([]);
      });
  }, [charactersEndpoint]);

  // Calculate the bonus for each PC-NPC pair
  const getBonus = (pc, npc) => {
    if (!pc.npcRelationships) return 0;
    // Sum all bonuses for this NPC
    return pc.npcRelationships
      .filter(rel => rel.npcId === npc.id)
      .reduce((sum, rel) => sum + (rel.bonus || 0), 0);
  };

  // Get all relationships for a PC-NPC pair
  const getRelationships = (pc, npc) => {
    if (!pc.npcRelationships) return [];
    return pc.npcRelationships.filter(rel => rel.npcId === npc.id);
  };

  // Calculate total for each NPC (column sum)
  const npcTotals = npcCharacters.map(npc =>
    pcCharacters.reduce((sum, pc) => sum + getBonus(pc, npc), 0)
  );

  return (
    <div>
      <h2>NPC Characters</h2>
      <ul>
        {npcCharacters.map((char) => (
          <li key={char.id}>
            <Link to={`/character/${char.id}`}>
              {char.name} {char.class ? `- ${char.class}` : ''}
            </Link>
          </li>
        ))}
      </ul>
      <h2>PC Characters</h2>
      <ul>
        {pcCharacters.map((char) => (
          <li key={char.id}>
            <Link to={`/character/${char.id}`}>
              {char.name} {char.class ? `- ${char.class}` : ''}
            </Link>
          </li>
        ))}
      </ul>
      <h2>PC vs NPC Value Table</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>PC \ NPC</th>
            {npcCharacters.map((npc) => (
              <th key={npc.id}>{npc.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pcCharacters.map((pc) => (
            <tr key={pc.id}>
              <td>
                <Link to={`/character/${pc.id}`}>
                  {pc.name}
                </Link>
              </td>
              {npcCharacters.map((npc) => {
                const relationships = getRelationships(pc, npc);
                const tooltip = relationships.length
                  ? relationships.map(rel =>
                      `Bonus: ${rel.bonus}, Description: ${rel.description || ''}`
                    ).join('\n')
                  : '';
                return (
                  <td key={npc.id} title={tooltip}>
                    {getBonus(pc, npc)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td><strong>Total per NPC</strong></td>
            {npcTotals.map((total, idx) => (
              <td key={idx}><strong>{total}</strong></td>
            ))}
          </tr>
        </tbody>
      </table>
      <Link to="/" style={{ display: 'block', marginTop: '1em' }}>
        Back to Home
      </Link>
    </div>
  );
}

export default CharactersPage;