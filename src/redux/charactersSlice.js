import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_BACKEND_BASE;

export const fetchCharacters = createAsyncThunk(
  'characters/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${baseUrl}/characters`);
      if (!res.ok) throw new Error('Failed to fetch characters');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createCharacter = createAsyncThunk(
  'characters/create',
  async (character, thunkAPI) => {
    try {
      const res = await fetch(`${baseUrl}/character`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });
      if (!res.ok) throw new Error('Failed to create character');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateCharacter = createAsyncThunk(
  'characters/update',
  async (character, thunkAPI) => {
    try {
      const res = await fetch(`${baseUrl}/character/${character.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });
      if (!res.ok) throw new Error('Failed to update character');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteCharacter = createAsyncThunk(
  'characters/delete',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${baseUrl}/character/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete character');
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState: { entities: [], status: 'idle', error: null },
  reducers: {
    // local-only reducers can go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload || [];
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(updateCharacter.fulfilled, (state, action) => {
        state.entities = state.entities.map(e => e.id === action.payload.id ? action.payload : e);
      })
      .addCase(deleteCharacter.fulfilled, (state, action) => {
        state.entities = state.entities.filter(e => e.id !== action.payload);
      });
  }
});

// selectors
export const selectAllCharacters = state => state.characters.entities;
export const selectCharacterById = (state, id) => state.characters.entities.find(c => c.id === id);
export const selectPcCharacters = state => state.characters.entities.filter(c => !c.npc);
export const selectAlivePCs = state => selectPcCharacters(state).filter(c => !c.dead);
export const selectDeadPCs = state => selectPcCharacters(state).filter(c => !!c.dead);

export default charactersSlice.reducer;