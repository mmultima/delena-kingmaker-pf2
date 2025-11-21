import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Fetch character from backend using the provided id as a path variable
const fetchCharacter = async (id) => {
    const baseUrl = process.env.REACT_APP_BACKEND_BASE;
    const response = await fetch(`${baseUrl}/character/${id}`);
    if (!response.ok) throw new Error('Character not found');
    return await response.json();
};

// Fetch all NPC characters
const fetchNpcCharacters = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_BASE;
    const response = await fetch(`${baseUrl}/characters`);
    if (!response.ok) throw new Error('Failed to fetch characters');
    const allCharacters = await response.json();
    return allCharacters.filter(char => char.npc);
};

// Update character
const updateCharacter = async (character) => {
    const baseUrl = process.env.REACT_APP_BACKEND_BASE;
    const response = await fetch(`${baseUrl}/character/${character.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
    });
    if (!response.ok) throw new Error('Failed to update character');
    return await response.json();
};

// Create character using backend POST endpoint
const createCharacter = async (character) => {
    const baseUrl = process.env.REACT_APP_BACKEND_BASE;
    const response = await fetch(`${baseUrl}/character`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
    });
    if (!response.ok) throw new Error('Failed to create character');
    return await response.json();
};

export default function Character() {
    const baseUrl = process.env.REACT_APP_BACKEND_BASE;
    const imageEndpoint = `${baseUrl}/image`;

    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [newMode, setNewMode] = useState(false);

    // Add relationship editing state
    const [relEditing, setRelEditing] = useState(false);
    const [relForm, setRelForm] = useState({ npcId: '', bonus: 0, description: '' });

    // NPC characters for name lookup
    const [npcCharacters, setNpcCharacters] = useState([]);

    useEffect(() => {
        fetchNpcCharacters()
            .then(setNpcCharacters)
            .catch(() => setNpcCharacters([]));
    }, []);

    useEffect(() => {
        // If route is /character/new, open in new character mode
        if (id === 'new') {
            setNewMode(true);
            setEditing(true);
            setForm({ name: '', image: '', kingmaker: false, npc: false, companion: false, dead: false });
            setCharacter(null);
            return;
        }

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

    // Add relationship to form
    const handleAddRelationship = () => {
        setRelEditing(true);
        setRelForm({ npcId: '', bonus: 0, description: '' });
    };

    // Save new relationship to form (use functional form)
    const handleSaveRelationship = () => {
        setForm(prevForm => ({
            ...prevForm,
            npcRelationships: [
                ...(prevForm.npcRelationships || []),
                { ...relForm }
            ]
        }));
        setRelEditing(false);
    };

    // Remove relationship from form
    const handleRemoveRelationship = (idx) => {
        setForm({
            ...form,
            npcRelationships: form.npcRelationships.filter((_, i) => i !== idx)
        });
    };

    // Relationship field change
    const handleRelChange = (e) => {
        const { name, value } = e.target;
        setRelForm({
            ...relForm,
            [name]: name === 'bonus' ? Number(value) : value
        });
    };

    // Helper to get NPC name by id
    const getNpcName = (npcId) => {
        const npc = npcCharacters.find(n => n.id === npcId);
        return npc ? npc.name : npcId;
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
                        Image:
                        <input name="image" value={form.image || ''} onChange={handleChange} />
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
                    <label>
                        Companion:
                        <input
                            name="companion"
                            type="checkbox"
                            checked={!!form.companion}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Dead:
                        <input
                            name="dead"
                            type="checkbox"
                            checked={!!form.dead}
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
                        Image:
                        <input name="image" value={form.image || ''} onChange={handleChange} />
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
                    <label>
                        Companion:
                        <input
                            name="companion"
                            type="checkbox"
                            checked={!!form.companion}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Dead:
                        <input
                            name="dead"
                            type="checkbox"
                            checked={!!form.dead}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <h3>NPC Relationships</h3>
                    <ul>
                        {(form.npcRelationships || []).map((rel, idx) => (
                            <li key={idx}>
                                <strong>NPC:</strong> {getNpcName(rel.npcId)} ({rel.npcId}), <strong>Bonus:</strong> {rel.bonus}, <strong>Description:</strong> {rel.description}
                                <button type="button" onClick={() => handleRemoveRelationship(idx)} style={{ marginLeft: 8 }}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    {relEditing ? (
                        <div style={{ marginBottom: '1em' }}>
                            <label>
                                NPC:
                                <select
                                    name="npcId"
                                    value={relForm.npcId}
                                    onChange={handleRelChange}
                                >
                                    <option value="">Select NPC</option>
                                    {npcCharacters.map(npc => (
                                        <option key={npc.id} value={npc.id}>
                                            {npc.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <br />
                            <label>
                                Bonus:
                                <input name="bonus" type="number" value={relForm.bonus} onChange={handleRelChange} />
                            </label>
                            <br />
                            <label>
                                Description:
                                <input name="description" value={relForm.description} onChange={handleRelChange} />
                            </label>
                            <br />
                            <button type="button" onClick={handleSaveRelationship}>Add</button>
                        </div>
                    ) : (
                        <button type="button" onClick={handleAddRelationship}>Add Relationship</button>
                    )}
                    <br />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel</button>
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {character.name}</p>
                    <p><strong>Id:</strong> {character.id}</p>
                    <p><strong>Image:</strong> {character.image}</p>
                    <p><strong>Kingmaker:</strong> {character.kingmaker ? 'Yes' : 'No'}</p>
                    <p><strong>NPC:</strong> {character.npc ? 'Yes' : 'No'}</p>
                    <p><strong>Companion:</strong> {character.companion ? 'Yes' : 'No'}</p>
                    <h3>NPC Relationships</h3>
                    <ul>
                        {(character.npcRelationships || []).map((rel, idx) => (
                            <li key={idx}>
                                <strong>NPC:</strong> {getNpcName(rel.npcId)} ({rel.npcId}), <strong>Bonus:</strong> {rel.bonus}, <strong>Description:</strong> {rel.description}
                            </li>
                        ))}
                    </ul>
                    {/* Show image below other fields if character.image is set */}
                    {character.image && (
                        <img
                            src={`${imageEndpoint}/byparam?url=${encodeURIComponent(character.image)}`}
                            alt={character.name}
                            style={{ marginTop: '2em', maxWidth: '100%', borderRadius: '8px' }}
                        />
                    )}
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleNew} style={{ marginLeft: 8 }}>New Character</button>
                </div>
            )}
        </div>
    );
}