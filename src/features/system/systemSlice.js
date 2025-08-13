import { createSlice } from '@reduxjs/toolkit';

/**
 * System slice tracks the active SWAPI URL and whether the app is currently using
 * the fallback host. It's updated by baseQueryWithFallback.js
 * after a request succeeds, it reads in app to show the host chip.
 */
const initialState = { apiBaseUrl: '', usingFallback: false };

const slice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setApiHost(state, action) {
      state.apiBaseUrl = action.payload.baseUrl || '';
      state.usingFallback = !!action.payload.usingFallback;
    },
  },
});

export const { setApiHost } = slice.actions;
export default slice.reducer;
