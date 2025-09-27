import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CharactersPage from './CharactersPage'; // <-- import the new file
import Character from './Character'; // <-- import the Character component

function Home({ helloContent }) {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
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
      </a>
      <div style={{ marginTop: '1em' }}>
        {helloContent}
        <br />
        <Link to="/characters">Characters</Link>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App