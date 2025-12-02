import React from 'react';
import { Link } from 'react-router-dom';

export default function CharacterButton({ character, buttonWidth, guest }) {
  const style = {
    display: 'inline-block',
    width: buttonWidth ? `${buttonWidth}px` : 'auto',
    margin: '0.5em 0',
    padding: '0.75em 1.25em',
    borderRadius: '24px',
    background: character.dead ? '#aaa' : (guest ? '#ff8a65' : '#1976d2'),
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    opacity: character.dead ? 0.6 : 1,
    textAlign: 'center',
  };

  return (
    <Link
      to={`/character/${character.id}`}
      className="char-button"
      style={style}
    >
      {character.name}{character.class ? ` - ${character.class}` : ''}{character.dead ? ' (Dead)' : ''}
    </Link>
  );
}