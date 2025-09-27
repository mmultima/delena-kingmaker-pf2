import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Fetch character from backend using the provided id as a path variable
const fetchCharacter = async (id) => {
    const response = await fetch(`http://localhost:8080/character/${id}`);
    if (!response.ok) throw new Error('Character not found');
    return await response.json();
};

// Update character (replace with real API call if needed)
const updateCharacter = async (character) => {
    // Normally you'd send a PUT request to your backend here
    return character;
};

// Create character using backend POST endpoint
const createCharacter = async (character) => {
    const response = await fetch('http://localhost:8080/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
    });
    if (!response.ok) throw new Error('Failed to create character');
    return await response.json();
};

export default function Character() {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [newMode, setNewMode] = useState(false);

    useEffect(() => {
        if (id && !newMode) {
            fetchCharacter(id).then(data => {
                setCharacter(data);
                setForm(data);
            }).catch(() => setCharacter(null));
        }
    }, [id, newMode]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleEdit = () => setEditing(true);

    const handleCancel = () => {
        setForm(character || {});
        setEditing(false);
        setNewMode(false);
    };

    const handleSave = async () => {
        try {
            if (newMode) {
                const created = await createCharacter(form);
                setCharacter(created);
                setNewMode(false);
                setEditing(false);
            } else {
                const updated = await updateCharacter(form);
                setCharacter(updated);
                setEditing(false);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleNew = () => {
        setForm({ name: '', kingmaker: false, npc: false });
        setCharacter(null);
        setNewMode(true);
        setEditing(true);
    };

    if (newMode && editing) {
        return (
            <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
                <h2>New Character</h2>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <label>
                        Name:
                        <input name="name" value={form.name || ''} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Kingmaker:
                        <input
                            name="kingmaker"
                            type="checkbox"
                            checked={!!form.kingmaker}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        NPC:
                        <input
                            name="npc"
                            type="checkbox"
                            checked={!!form.npc}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Create</button>
                    <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel</button>
                </form>
            </div>
        );
    }

    if (!character) {
        return (
            <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
                <h2>Character Details</h2>
                <div>Loading or character not found.</div>
                <button onClick={handleNew} style={{ marginTop: 16 }}>New Character</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Character Details</h2>
            {editing ? (
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <label>
                        Name:
                        <input name="name" value={form.name || ''} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Id:
                        <input name="id" value={form.id || ''} disabled />
                    </label>
                    <br />
                    <label>
                        Kingmaker:
                        <input
                            name="kingmaker"
                            type="checkbox"
                            checked={!!form.kingmaker}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        NPC:
                        <input
                            name="npc"
                            type="checkbox"
                            checked={!!form.npc}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel</button>
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {character.name}</p>
                    <p><strong>Id:</strong> {character.id}</p>
                    <p><strong>Kingmaker:</strong> {character.kingmaker ? 'Yes' : 'No'}</p>
                    <p><strong>NPC:</strong> {character.npc ? 'Yes' : 'No'}</p>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleNew} style={{ marginLeft: 8 }}>New Character</button>
                </div>
            )}
        </div>
    );
}