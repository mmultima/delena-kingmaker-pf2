import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CharactersPage from './CharactersPage'; // <-- import the new file
import Character from './Character'; // <-- import the Character component
import Loot from './Loot'; // <-- import the Loot component

function Home({ helloContent }) {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const imageEndpoint = `${baseUrl}/image`;

  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(imageEndpoint);
  }, [imageEndpoint]);

  return (
    <header className="App-header">
      <div style={{ marginTop: '1em' }}>
        {imageUrl && (
          <img
            src={`${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`}
            alt="Kingmaker"
          />
        )}
        <br />
        <Link to="/characters">Characters</Link>
        <Link to="/loot">Loot</Link>
        <br />
      </div>
    </header>
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

export default App