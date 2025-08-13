import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  page: 1,
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload ?? '';
      state.page = 1; // reset to first page on new search
    },
    setPage(state, action) {
      state.page = action.payload || 1;
    },
  },
});

export const { setSearch, setPage } = peopleSlice.actions;
export default peopleSlice.reducer;
