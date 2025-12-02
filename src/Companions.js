import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CharacterButton from './CharacterButton';
import { fetchBackgroundImage, selectBackgroundObjectUrl } from './redux/uiSlice';

export default function Companions() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;
  const imageEndpoint = `${baseUrl}/image`;
  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';

  const dispatch = useDispatch();
  const imageObjectUrl = useSelector(selectBackgroundObjectUrl);

  // ensure background image is loaded once (same as Home / CharactersPage)
  useEffect(() => {
    const fetchUrl = `${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`;
    if (!imageObjectUrl) {
      dispatch(fetchBackgroundImage(fetchUrl));
    }
  }, [dispatch, imageObjectUrl, imageEndpoint]);

  const [companions, setCompanions] = useState([]);
  useEffect(() => {
    let mounted = true;
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        setCompanions(data.filter(c => c.companion));
      })
      .catch(() => {
        if (mounted) setCompanions([]);
      });
    return () => { mounted = false; };
  }, [charactersEndpoint]);

  const [maxWidth, setMaxWidth] = useState(null);
  const measureRef = useRef(null);

  // measure widest button by rendering all companion buttons into a hidden container
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
  }, [companions]);

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
        <h2 style={{ textAlign: 'center' }}>Companions</h2>

        {/* Hidden measurement container */}
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
          {companions.map(char => (
            <CharacterButton key={`m-${char.id}`} character={char} />
          ))}
        </div>

        <div style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 480 }}>
          {companions.length === 0 && <div style={{ textAlign: 'center' }}>No companions found.</div>}
          {companions.map((char) => (
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