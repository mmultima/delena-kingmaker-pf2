import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/StoreConfiguration';
import './App.css';
import CharactersPage from './CharactersPage';
import Character from './Character';
import Loot from './Loot';
import PartyRelationship from './PartyRelationship';
import NpcCharacters from './NpcCharacters';
import Companions from './Companions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBackgroundImage, selectBackgroundObjectUrl } from './redux/uiSlice';

function Home({ helloContent }) {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const imageEndpoint = `${baseUrl}/image`;
  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';
  const dispatch = useDispatch();

  const imageObjectUrl = useSelector(selectBackgroundObjectUrl);

  useEffect(() => {
    // build the fetch URL and load only if not already loaded in store
    const fetchUrl = `${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`;
    if (!imageObjectUrl) {
      dispatch(fetchBackgroundImage(fetchUrl));
    }
    // keep empty deps except dispatch and imageObjectUrl so it runs once per app load
  }, [dispatch, imageObjectUrl, imageEndpoint]);

  return (
    <div
      className="home-bg"
      style={{ backgroundImage: `url(${imageObjectUrl || ''})` }}
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
  const [helloContent, setHelloContent] = React.useState('');
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const helloEndpoint = `${baseUrl}/hello`;

  useEffect(() => {
    fetch(helloEndpoint)
      .then((response) => response.text())
      .then((data) => setHelloContent(data))
      .catch(() => setHelloContent('Error fetching content'));
  }, [helloEndpoint]);

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;