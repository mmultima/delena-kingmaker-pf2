import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from './charactersSlice';
import lootReducer from './lootSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    characters: charactersReducer,
    loot: lootReducer,
    ui: uiReducer,
  },
  // optional: enable redux devtools only in dev
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;