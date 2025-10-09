import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CharactersPage from './CharactersPage';
import Character from './Character';
import Loot from './Loot';

function Home({ helloContent }) {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const imageEndpoint = `${baseUrl}/image`;
  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(`${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`);
  }, [imageEndpoint, coverImageUrl]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '16px',
        padding: '2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1em',
        marginTop: '2em'
      }}>
        <Link
          to="/characters"
          style={{
            display: 'block',
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            background: '#1976d2',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '120px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            textDecoration: 'none',
            marginBottom: '1em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'background 0.2s',
          }}
        >
          Characters
        </Link>
        <Link
          to="/loot"
          style={{
            display: 'block',
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            background: '#388e3c',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '120px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            textDecoration: 'none',
            marginBottom: '1em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'background 0.2s',
          }}
        >
          Loot
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [helloContent, setHelloContent] = useState('');
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const helloEndpoint = `${baseUrl}/hello`;

  useEffect(() => {
    fetch(helloEndpoint)
      .then((response) => response.text())
      .then((data) => setHelloContent(data))
      .catch((error) => setHelloContent('Error fetching content'));
  }, [helloEndpoint]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home helloContent={helloContent} />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/character/:id" element={<Character />} />
          <Route path="/loot" element={<Loot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;