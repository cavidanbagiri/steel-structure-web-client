// stores/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './user_slice.js';
import transportSlice from './transport_slice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    transport: transportSlice
  },
});

export default store;