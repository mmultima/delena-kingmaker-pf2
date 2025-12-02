import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CharacterButton from './CharacterButton';
import { fetchBackgroundImage, selectBackgroundObjectUrl } from './redux/uiSlice';

export default function NpcCharacters() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;
  const imageEndpoint = `${baseUrl}/image`;
  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';

  const dispatch = useDispatch();
  const imageObjectUrl = useSelector(selectBackgroundObjectUrl);

  useEffect(() => {
    const fetchUrl = `${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`;
    if (!imageObjectUrl) dispatch(fetchBackgroundImage(fetchUrl));
  }, [dispatch, imageObjectUrl, imageEndpoint]);

  const [npcCharacters, setNpcCharacters] = useState([]);
  useEffect(() => {
    let mounted = true;
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        setNpcCharacters(data.filter(c => c.npc && !c.companion));
      })
      .catch(() => {
        if (mounted) setNpcCharacters([]);
      });
    return () => { mounted = false; };
  }, [charactersEndpoint]);

  const [maxWidth, setMaxWidth] = useState(null);
  const measureRef = useRef(null);

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
  }, [npcCharacters]);

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

  const newButtonStyle = {
    ...tabBaseStyle,
    background: '#2e7d32',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
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
      <div style={{ maxWidth: 720, margin: '0 auto', background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ textAlign: 'center' }}>NPC Characters</h2>

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
          {npcCharacters.map(char => (
            <CharacterButton key={`m-${char.id}`} character={char} />
          ))}
        </div>

        <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
          {npcCharacters.length === 0 && <div style={{ textAlign: 'center' }}>No NPCs found.</div>}
          {npcCharacters.map((char) => (
            <div key={char.id} style={{ marginBottom: '8px' }}>
              <CharacterButton character={char} buttonWidth={maxWidth} guest={!!char.guest} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1.25rem' }}>
          <Link to="/character/new" style={newButtonStyle}>New</Link>
          <Link to="/" style={homeButtonStyle}>Home</Link>
        </div>
      </div>
    </div>
  );
}