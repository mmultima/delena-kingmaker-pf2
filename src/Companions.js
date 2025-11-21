import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Companions() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;
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

  return (
    <div>
      <h2>Companions</h2>
      <ul>
        {companions.length === 0 && <li>No companions found.</li>}
        {companions.map(char => (
          <li key={char.id}>
            <Link to={`/character/${char.id}`}>
              {char.name}{char.class ? ` - ${char.class}` : ''}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/" style={{ display: 'block', marginTop: '1em' }}>
        Back to Home
      </Link>
    </div>
  );
}