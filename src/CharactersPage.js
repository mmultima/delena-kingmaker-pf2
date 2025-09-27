import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CharactersPage() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;

  const [fetchedCharacters, setFetchedCharacters] = useState([]);
  const [npcCharacters, setNpcCharacters] = useState([]);
  const [pcCharacters, setPcCharacters] = useState([]);

  React.useEffect(() => {
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        setFetchedCharacters(data);
        setNpcCharacters(data.filter(char => char.npc));
        setPcCharacters(data.filter(char => !char.npc));
      })
      .catch(() => {
        setFetchedCharacters([]);
        setNpcCharacters([]);
        setPcCharacters([]);
      });
  }, []);

  // Initialize values as a 2D array (PC x NPC)
  const [values, setValues] = useState([]);
  React.useEffect(() => {
    setValues(
      Array(pcCharacters.length)
        .fill(0)
        .map(() => Array(npcCharacters.length).fill(0))
    );
  }, [pcCharacters.length, npcCharacters.length]);

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
          {pcCharacters.map((pc, pcIdx) => (
            <tr key={pc.id}>
              <td>
                <Link to={`/character/${pc.id}`}>
                  {pc.name}
                </Link>
              </td>
              {npcCharacters.map((npc, npcIdx) => (
                <td key={npc.id}>
                  <input
                    type="number"
                    value={values[pcIdx] ? values[pcIdx][npcIdx] : 0}
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