import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';
import searchReducer from './slices/searchSlice';
import { productsApi } from './services/productsApi';


const store = configureStore({
  reducer: {
    cart: cartReducer,
    userPref: userPreferencesReducer,
    search: searchReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
