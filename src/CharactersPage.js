import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CharacterButton from './CharacterButton';
import { fetchBackgroundImage, selectBackgroundObjectUrl } from './redux/uiSlice';

function CharactersPage() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;
  const imageEndpoint = `${baseUrl}/image`;
  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';

  const dispatch = useDispatch();
  const imageObjectUrl = useSelector(selectBackgroundObjectUrl);

  // ensure background image is loaded once (same as Home)
  useEffect(() => {
    const fetchUrl = `${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`;
    if (!imageObjectUrl) {
      dispatch(fetchBackgroundImage(fetchUrl));
    }
  }, [dispatch, imageObjectUrl, imageEndpoint]);

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

  const [activeTab, setActiveTab] = useState('alive'); // 'alive' | 'guest' | 'dead'

  // Split PCs into tabs
  const guestPCs = pcCharacters.filter(char => !char.dead && char.guest);
  const alivePCs = pcCharacters.filter(char => !char.dead && !char.guest);
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
    padding: '8px 16px',     // slightly less wide
    borderRadius: 20,
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    border: '1px solid transparent',
    minWidth: 96,            // reduced min width
    textAlign: 'center'
  };

  const aliveStyle = {
    ...tabBaseStyle,
    background: activeTab === 'alive' ? '#1565c0' : '#1976d2',
    color: '#fff',
    border: activeTab === 'alive' ? '2px solid #0d47a1' : '1px solid rgba(0,0,0,0.08)'
  };

  const guestStyle = {
    ...tabBaseStyle,
    background: activeTab === 'guest' ? '#ff7043' : '#ff8a65',
    color: '#fff',
    border: activeTab === 'guest' ? '2px solid #e64a19' : '1px solid rgba(0,0,0,0.08)'
  };

  const deadStyle = {
    ...tabBaseStyle,
    background: activeTab === 'dead' ? '#757575' : '#9e9e9e',
    color: '#fff',
    border: activeTab === 'dead' ? '2px solid #616161' : '1px solid rgba(0,0,0,0.08)'
  };

  const homeButtonStyle = {
    ...tabBaseStyle,
    padding: '8px 14px',
    minWidth: 92,
    background: '#1976d2',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const newButtonStyle = {
    ...tabBaseStyle,
    padding: '8px 14px',
    minWidth: 92,
    background: '#2e7d32',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div
      style={{
        backgroundImage: `url(${imageObjectUrl || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', background: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ textAlign: 'center' }}>PC Characters</h2>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
          <button onClick={() => setActiveTab('alive')} style={aliveStyle}>
            Alive
          </button>
          <button onClick={() => setActiveTab('guest')} style={guestStyle}>
            Guests
          </button>
          <button onClick={() => setActiveTab('dead')} style={deadStyle}>
            Dead
          </button>
        </div>

        {/* Hidden measurement container - renders all buttons (alive+guest+dead) to compute max width */}
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
          {pcCharacters.map(char => (
            <CharacterButton key={`m-${char.id}`} character={char} guest={!!char.guest} />
          ))}
        </div>

        <div>
          {activeTab === 'alive' ? (
            <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
              {alivePCs.length === 0 && <div style={{ textAlign: 'center' }}>No alive PCs.</div>}
              {alivePCs.map((char) => (
                <div key={char.id} style={{ marginBottom: '8px' }}>
                  <CharacterButton character={char} buttonWidth={maxWidth} guest={!!char.guest} />
                </div>
              ))}
            </div>
          ) : activeTab === 'guest' ? (
            <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
              {guestPCs.length === 0 && <div style={{ textAlign: 'center' }}>No guest PCs.</div>}
              {guestPCs.map((char) => (
                <div key={char.id} style={{ marginBottom: '8px' }}>
                  <CharacterButton character={char} buttonWidth={maxWidth} guest />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
              {deadPCs.length === 0 && <div style={{ textAlign: 'center' }}>No dead PCs.</div>}
              {deadPCs.map((char) => (
                <div key={char.id} style={{ marginBottom: '8px' }}>
                  <CharacterButton character={char} buttonWidth={maxWidth} guest={!!char.guest} />
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
    </div>
  );
}

export default CharactersPage;