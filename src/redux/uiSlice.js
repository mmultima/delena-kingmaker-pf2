import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBackgroundImage = createAsyncThunk(
  'ui/fetchBackgroundImage',
  async (imageFetchUrl, thunkAPI) => {
    const res = await fetch(imageFetchUrl);
    if (!res.ok) throw new Error('Failed to fetch image');
    const blob = await res.blob();
    // create object URL so components can use it directly in CSS url(...)
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    imageObjectUrl: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearBackground(state) {
      if (state.imageObjectUrl) {
        try { URL.revokeObjectURL(state.imageObjectUrl); } catch (e) {}
      }
      state.imageObjectUrl = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBackgroundImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBackgroundImage.fulfilled, (state, action) => {
        // revoke previous if present
        if (state.imageObjectUrl) {
          try { URL.revokeObjectURL(state.imageObjectUrl); } catch (e) {}
        }
        state.imageObjectUrl = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchBackgroundImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Failed to load image';
      });
  }
});

export const { clearBackground } = uiSlice.actions;
export const selectBackgroundObjectUrl = (state) => state.ui?.imageObjectUrl;
export default uiSlice.reducer;