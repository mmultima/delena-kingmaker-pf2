import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CharactersPage from './CharactersPage';
import Character from './Character';
import Loot from './Loot';
import PartyRelationship from './PartyRelationship';
import NpcCharacters from './NpcCharacters';
import Companions from './Companions';

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
      className="home-bg"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="home-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <Link to="/characters" className="round-btn">Characters</Link>
          <Link to="/loot" className="round-btn loot">Loot</Link>
          <Link to="/relations" className="round-btn" style={{ background: '#8e44ad' }}>Relations</Link>
          <Link to="/npccharacters" className="round-btn" style={{ background: '#f39c12' }}>NPCs</Link>
          <Link to="/companions" className="round-btn" style={{ background: '#2ecc71' }}>Companions</Link>
        </div>
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
          <Route path="/relations" element={<PartyRelationship />} />
          <Route path="/npccharacters" element={<NpcCharacters />} />
          <Route path="/companions" element={<Companions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;