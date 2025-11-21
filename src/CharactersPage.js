import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CharacterButton from './CharacterButton';

function CharactersPage() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;

  const [pcCharacters, setPcCharacters] = useState([]);
  const [maxWidth, setMaxWidth] = useState(null);
  const measureRef = useRef(null);

  useEffect(() => {
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        setPcCharacters(data.filter(char => !char.npc));
      })
      .catch(() => {
        setPcCharacters([]);
      });
  }, [charactersEndpoint]);

  const [activeTab, setActiveTab] = useState('alive'); // 'alive' | 'dead'

  // Split PCs into alive and dead
  const alivePCs = pcCharacters.filter(char => !char.dead);
  const deadPCs = pcCharacters.filter(char => char.dead);

  // measure widest button by rendering all buttons into a hidden container
  useLayoutEffect(() => {
    const measure = () => {
      if (!measureRef.current) {
        setMaxWidth(null);
        return;
      }
      const buttons = measureRef.current.querySelectorAll('.char-button');
      if (!buttons || buttons.length === 0) {
        setMaxWidth(null);
        return;
      }
      let max = 0;
      buttons.forEach(b => {
        const w = b.getBoundingClientRect().width;
        if (w > max) max = Math.ceil(w);
      });
      setMaxWidth(max);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pcCharacters]);

  const tabBaseStyle = {
    padding: '10px 20px',
    borderRadius: 24,
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    border: '1px solid transparent',
    minWidth: 120,
    textAlign: 'center'
  };

  const aliveStyle = {
    ...tabBaseStyle,
    background: activeTab === 'alive' ? '#1565c0' : '#1976d2',
    color: '#fff',
    border: activeTab === 'alive' ? '2px solid #0d47a1' : '1px solid rgba(0,0,0,0.08)'
  };

  const deadStyle = {
    ...tabBaseStyle,
    background: activeTab === 'dead' ? '#757575' : '#9e9e9e',
    color: '#fff',
    border: activeTab === 'dead' ? '2px solid #616161' : '1px solid rgba(0,0,0,0.08)'
  };

  const homeButtonStyle = {
    ...tabBaseStyle,
    background: '#1976d2',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const newButtonStyle = {
    ...tabBaseStyle,
    background: '#2e7d32',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>PC Characters</h2>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
        <button onClick={() => setActiveTab('alive')} style={aliveStyle}>
          Alive ({alivePCs.length})
        </button>
        <button onClick={() => setActiveTab('dead')} style={deadStyle}>
          Dead ({deadPCs.length})
        </button>
      </div>

      {/* Hidden measurement container - renders all buttons (alive+dead) to compute max width */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          visibility: 'hidden',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        {alivePCs.map(char => (
          <CharacterButton key={`m-a-${char.id}`} character={char} />
        ))}
        {deadPCs.map(char => (
          <CharacterButton key={`m-d-${char.id}`} character={char} />
        ))}
      </div>

      <div>
        {activeTab === 'alive' ? (
          <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
            {alivePCs.length === 0 && <div style={{ textAlign: 'center' }}>No alive PCs.</div>}
            {alivePCs.map((char) => (
              <div key={char.id} style={{ marginBottom: '8px' }}>
                <CharacterButton character={char} buttonWidth={maxWidth} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
            {deadPCs.length === 0 && <div style={{ textAlign: 'center' }}>No dead PCs.</div>}
            {deadPCs.map((char) => (
              <div key={char.id} style={{ marginBottom: '8px' }}>
                <CharacterButton character={char} buttonWidth={maxWidth} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls below the list: New (left) and Home (right), centered as a group */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1.25rem' }}>
        <Link to="/character/new" style={newButtonStyle}>New</Link>
        <Link to="/" style={homeButtonStyle}>Home</Link>
      </div>
    </div>
  );
}

export default CharactersPage;