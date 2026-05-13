// stores/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './user_slice.js';
import transportSlice from './transport_slice.js'
import mainSlice from './main_slice.js'
import erectedSlice from './erected_slice.js'
import combineSlice from './combine_slice.js'
import statisticSlice from './statistic_slice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    transport: transportSlice,
    main: mainSlice,
    erected: erectedSlice,
    combine: combineSlice,
    statistic: statisticSlice
  },
});

export default store;