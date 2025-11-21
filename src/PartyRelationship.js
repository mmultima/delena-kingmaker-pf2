import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PartyRelationship() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;

  const [npcCharacters, setNpcCharacters] = useState([]);
  const [pcCharacters, setPcCharacters] = useState([]);

  useEffect(() => {
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        setNpcCharacters(data.filter(c => c.npc && c.companion));
        // only include companion PCs
        setPcCharacters(data.filter(c => !c.npc));
      })
      .catch(() => {
        setNpcCharacters([]);
        setPcCharacters([]);
      });
  }, [charactersEndpoint]);

  const getRelationships = (pc, npc) => {
    if (!pc.npcRelationships) return [];
    return pc.npcRelationships.filter(rel => rel.npcId === npc.id);
  };

  const getBonus = (pc, npc) => {
    return getRelationships(pc, npc).reduce((sum, rel) => sum + (rel.bonus || 0), 0);
  };

  const npcTotals = npcCharacters.map(npc =>
    pcCharacters.reduce((sum, pc) => sum + getBonus(pc, npc), 0)
  );

  return (
    <div>
      <h2>Party Relationship Totals</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>PC \ NPC</th>
            {npcCharacters.map(npc => <th key={npc.id}>{npc.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {pcCharacters.map(pc => (
            <tr key={pc.id}>
              <td>
                <Link to={`/character/${pc.id}`}>{pc.name}{pc.dead ? ' (Dead)' : ''}</Link>
              </td>
              {npcCharacters.map(npc => {
                const rels = getRelationships(pc, npc);
                const tooltip = rels.length
                  ? rels.map(r => `Bonus: ${r.bonus}, Description: ${r.description || ''}`).join('\n')
                  : '';
                return <td key={npc.id} title={tooltip}>{getBonus(pc, npc)}</td>;
              })}
            </tr>
          ))}
          <tr>
            <td><strong>Total per NPC</strong></td>
            {npcTotals.map((t, i) => <td key={i}><strong>{t}</strong></td>)}
          </tr>
        </tbody>
      </table>
      <Link to="/" style={{ display: 'block', marginTop: '1em' }}>
        Back to Home
      </Link>
    </div>
  );
}