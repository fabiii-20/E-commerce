import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type PreferencesState = {
    sortBy: 'price' | 'rating';
    categoryFilter: string | null;
  };
  
  const initialState: PreferencesState = {
    sortBy: 'price',
    categoryFilter: null,
  };
const userPrefSlice =  createSlice({
    name: 'userPreferences',
    initialState,
    reducers: {
        setSortBy: (state, action: PayloadAction<'price' | 'rating'>) => {
          state.sortBy = action.payload;
        },
        setCategoryFilter: (state, action: PayloadAction<string | null>) => {
          state.categoryFilter = action.payload;
        },
      },
})
export const { setSortBy, setCategoryFilter } = userPrefSlice.actions;
export default userPrefSlice.reducer;