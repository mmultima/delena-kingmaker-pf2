import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_BACKEND_BASE;
const lootEndpoint = `${baseUrl}/loot`;

export const fetchLoot = createAsyncThunk('loot/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await fetch(lootEndpoint);
    if (!res.ok) throw new Error('Failed to fetch loot');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createLoot = createAsyncThunk('loot/create', async (item, thunkAPI) => {
  try {
    const res = await fetch(lootEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to create loot');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateLoot = createAsyncThunk('loot/update', async (item, thunkAPI) => {
  try {
    const res = await fetch(`${lootEndpoint}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to update loot');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteLoot = createAsyncThunk('loot/delete', async (id, thunkAPI) => {
  try {
    const res = await fetch(`${lootEndpoint}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete loot');
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const lootSlice = createSlice({
  name: 'loot',
  initialState: { entities: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoot.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLoot.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload || [];
      })
      .addCase(fetchLoot.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createLoot.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(updateLoot.fulfilled, (state, action) => {
        state.entities = state.entities.map(e => e.id === action.payload.id ? action.payload : e);
      })
      .addCase(deleteLoot.fulfilled, (state, action) => {
        state.entities = state.entities.filter(e => e.id !== action.payload);
      });
  }
});

export const selectAllLoot = state => state.loot.entities;
export default lootSlice.reducer;