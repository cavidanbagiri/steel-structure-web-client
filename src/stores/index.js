// stores/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './user_slice.js';
import transportSlice from './transport_slice.js'
import mainSlice from './main_slice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    transport: transportSlice,
    main: mainSlice
  },
});

export default store;