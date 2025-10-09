import React from 'react';
import { Link } from 'react-router-dom';

function Loot() {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h2>Loot</h2>
      <p>This is the Loot page. Add your loot management features here.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Loot;