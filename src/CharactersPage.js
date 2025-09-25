import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CharactersPage() {
  const npcCharacters = [
    { name: 'Valerie', class: 'Fighter' },
    { name: 'Amiri', class: 'Barbarian' },
    { name: 'Linzi', class: 'Bard' },
  ];

  const pcCharacters = [
    { name: 'Lady Delena Surtova', class: 'Witch' },
    { name: 'Meril', class: 'Oracle' },
    { name: 'Marian', class: 'Wizard' },
    { name: 'Boromir Keaton', class: 'Fighter' },
    { name: 'Tavian', class: 'Barbarian' },
  ];

  // Initialize values as a 2D array (PC x NPC)
  const [values, setValues] = useState(
    Array(pcCharacters.length)
      .fill(0)
      .map(() => Array(npcCharacters.length).fill(0))
  );

  // Handle cell edit
  const handleChange = (pcIdx, npcIdx, event) => {
    const newValues = values.map(row => [...row]);
    newValues[pcIdx][npcIdx] = Number(event.target.value);
    setValues(newValues);
  };

  // Calculate total for each NPC (column sum)
  const npcTotals = npcCharacters.map((_, npcIdx) =>
    values.reduce((sum, row) => sum + row[npcIdx], 0)
  );

  return (
    <div>
      <h2>NPC Characters</h2>
      <ul>
        {npcCharacters.map((char, idx) => (
          <li key={idx}>
            {char.name} - {char.class}
          </li>
        ))}
      </ul>
      <h2>PC Characters</h2>
      <ul>
        {pcCharacters.map((char, idx) => (
          <li key={idx}>
            {char.name} - {char.class}
          </li>
        ))}
      </ul>
      <h2>PC vs NPC Value Table</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>PC \ NPC</th>
            {npcCharacters.map((npc, idx) => (
              <th key={idx}>{npc.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pcCharacters.map((pc, pcIdx) => (
            <tr key={pcIdx}>
              <td>{pc.name}</td>
              {npcCharacters.map((npc, npcIdx) => (
                <td key={npcIdx}>
                  <input
                    type="number"
                    value={values[pcIdx][npcIdx]}
                    onChange={e => handleChange(pcIdx, npcIdx, e)}
                    style={{ width: '50px' }}
                  />
                </td>
              ))}
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