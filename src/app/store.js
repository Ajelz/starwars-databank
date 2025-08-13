import { configureStore } from '@reduxjs/toolkit';
import { swapiApi } from '../services/swapiApi.js';
import peopleReducer from '../features/people/peopleSlice.js';
import systemReducer from '../features/system/systemSlice.js';

export const store = configureStore({
  reducer: {
    system: systemReducer,
    [swapiApi.reducerPath]: swapiApi.reducer,
    people: peopleReducer,
  },
  middleware: (g) => g().concat(swapiApi.middleware),
  devTools: true,
});
