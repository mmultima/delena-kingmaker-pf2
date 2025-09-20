
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
  const [helloContent, setHelloContent] = useState('');

  useEffect(() => {
    fetch('https://delena-kingmaker-pf2-backend.azurewebsites.net/hello')
      .then((response) => response.text())
      .then((data) => setHelloContent(data))
      .catch((error) => setHelloContent('Error fetching content'));
  }, []);

  return (
    <div className="App">
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
        </div>
      </header>
    </div>
  );
}

export default App;
