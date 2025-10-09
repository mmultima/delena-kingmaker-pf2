import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CharactersPage from './CharactersPage'; // <-- import the new file
import Character from './Character'; // <-- import the Character component
import Loot from './Loot'; // <-- import the Loot component

function Home({ helloContent }) {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const imageEndpoint = `${baseUrl}/image`;

  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';
  const coverImageEndpoint = `${baseUrl}/cover-image`;  

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(imageEndpoint);
  }, [imageEndpoint]);

  return (
    <header className="App-header">
      {/* <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a> */}
      <div style={{ marginTop: '1em' }}>
        {imageUrl && (
          // src={imageUrl}
          <img
            src={`${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`}
            alt="Kingmaker"
            // style={{ marginTop: '2em', maxWidth: '400px', width: '100%' }}
          />
        )}
        {/* {helloContent} */}
        <br />
        <Link to="/characters">Characters</Link>
        {/* <br /> */}
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