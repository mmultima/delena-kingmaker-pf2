import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Loot() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const lootEndpoint = `${baseUrl}/loot`;
  const charactersEndpoint = `${baseUrl}/characters`;
  const [lootList, setLootList] = useState([]);
  const [pcCharacters, setPcCharacters] = useState([]);
  const [newLoot, setNewLoot] = useState({
    name: '',
    description: '',
    value: 0,
    characterId: '',
    sold: false,
  });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editLoot, setEditLoot] = useState(null);

  useEffect(() => {
    fetch(lootEndpoint)
      .then(res => res.json())
      .then(data => setLootList(data))
      .catch(() => setLootList([]));
  }, [lootEndpoint]);

  useEffect(() => {
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => setPcCharacters(data.filter(char => !char.npc)))
      .catch(() => setPcCharacters([]));
  }, [charactersEndpoint]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setNewLoot({
      ...newLoot,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditChange = (e) => {
    const { name, type, value, checked } = e.target;
    setEditLoot({
      ...editLoot,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = () => setAdding(true);

  const handleCancel = () => {
    setNewLoot({
      name: '',
      description: '',
      value: 0,
      characterId: '',
      sold: false,
    });
    setAdding(false);
    setEditingId(null);
    setEditLoot(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const response = await fetch(lootEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLoot),
    });
    if (response.ok) {
      const created = await response.json();
      setLootList([...lootList, created]);
      handleCancel();
    } else {
      alert('Failed to add loot');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditLoot({ ...item });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const response = await fetch(`${lootEndpoint}/${editLoot.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editLoot),
    });
    if (response.ok) {
      const updated = await response.json();
      setLootList(lootList.map(l => l.id === updated.id ? updated : l));
      handleCancel();
    } else {
      alert('Failed to update loot');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this loot item?')) return;
    const response = await fetch(`${lootEndpoint}/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setLootList(lootList.filter(l => l.id !== id));
      handleCancel();
    } else {
      alert('Failed to delete loot');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h2>Loot</h2>
      <ul>
        {lootList.length === 0 && <li>No loot found.</li>}
        {lootList.map((item, idx) => (
          <li key={item.id || idx} style={{ marginBottom: '1em' }}>
            {editingId === item.id ? (
              <form onSubmit={handleEditSave}>
                <label>
                  Name:
                  <input
                    name="name"
                    value={editLoot.name}
                    onChange={handleEditChange}
                    required
                    style={{ marginLeft: '0.5em' }}
                  />
                </label>
                <br />
                <label>
                  Description:
                  <input
                    name="description"
                    value={editLoot.description}
                    onChange={handleEditChange}
                    style={{ marginLeft: '0.5em' }}
                  />
                </label>
                <br />
                <label>
                  Value:
                  <input
                    name="value"
                    type="number"
                    value={editLoot.value}
                    onChange={handleEditChange}
                    style={{ marginLeft: '0.5em' }}
                  />
                </label>
                <br />
                <label>
                  Character:
                  <select
                    name="characterId"
                    value={editLoot.characterId}
                    onChange={handleEditChange}
                    style={{ marginLeft: '0.5em' }}
                  >
                    <option value="">None</option>
                    {pcCharacters.map(char => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                </label>
                <br />
                <label>
                  Sold:
                  <input
                    name="sold"
                    type="checkbox"
                    checked={!!editLoot.sold}
                    onChange={handleEditChange}
                    style={{ marginLeft: '0.5em' }}
                  />
                </label>
                <br />
                <button type="submit" style={{ marginTop: '1em' }}>Save</button>
                <button type="button" onClick={handleCancel} style={{ marginLeft: '0.5em' }}>Cancel</button>
              </form>
            ) : (
              <div>
                <strong>Name:</strong> {item.name} <br />
                <strong>Description:</strong> {item.description} <br />
                <strong>Value:</strong> {item.value} <br />
                <strong>Character:</strong> {pcCharacters.find(c => c.id === item.characterId)?.name || item.characterId || 'None'} <br />
                <strong>Sold:</strong> {item.sold ? 'Yes' : 'No'}
                <br />
                <button onClick={() => handleEdit(item)} style={{ marginTop: '0.5em' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '0.5em' }}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {adding ? (
        <form onSubmit={handleSave} style={{ marginTop: '1em' }}>
          <label>
            Name:
            <input
              name="name"
              value={newLoot.name}
              onChange={handleChange}
              required
              style={{ marginLeft: '0.5em' }}
            />
          </label>
          <br />
          <label>
            Description:
            <input
              name="description"
              value={newLoot.description}
              onChange={handleChange}
              style={{ marginLeft: '0.5em' }}
            />
          </label>
          <br />
          <label>
            Value:
            <input
              name="value"
              type="number"
              value={newLoot.value}
              onChange={handleChange}
              style={{ marginLeft: '0.5em' }}
            />
          </label>
          <br />
          <label>
            Character:
            <select
              name="characterId"
              value={newLoot.characterId}
              onChange={handleChange}
              style={{ marginLeft: '0.5em' }}
            >
              <option value="">None</option>
              {pcCharacters.map(char => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Sold:
            <input
              name="sold"
              type="checkbox"
              checked={!!newLoot.sold}
              onChange={handleChange}
              style={{ marginLeft: '0.5em' }}
            />
          </label>
          <br />
          <button type="submit" style={{ marginTop: '1em' }}>Add</button>
          <button type="button" onClick={handleCancel} style={{ marginLeft: '0.5em' }}>Cancel</button>
        </form>
      ) : (
        <button onClick={handleAdd} style={{ marginTop: '1em' }}>Add New Loot</button>
      )}
      <Link to="/" style={{ display: 'block', marginTop: '2em' }}>
        Back to Home
      </Link>
    </div>
  );
}

export default Loot;
// filepath: c:\Study\Kingmaker\delena-kingmaker-pf2\src\Loot.js