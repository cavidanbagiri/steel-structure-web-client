// stores/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './user_slice.js';

const store = configureStore({
  reducer: {
    auth: authSlice,  // Change from authSlice: authSlice to auth: authSlice
  },
});

export default store;