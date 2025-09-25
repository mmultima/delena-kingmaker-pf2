import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CharactersPage from './CharactersPage'; // <-- import the new file

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
  const helloEndpoint = 'http://localhost:8080/hello';

  useEffect(() => {
    fetch(helloEndpoint)
      .then((response) => response.text())
      .then((data) => setHelloContent(data))
      .catch((error) => setHelloContent('Error fetching content'));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home helloContent={helloContent} />} />
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App