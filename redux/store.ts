import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';
import searchReducer from './slices/searchSlice';
import { productsApi } from './services/productsApi';

function saveToLocalStorage(state: unknown) {
  if (typeof window === 'undefined') return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch (e) {
    console.error('Could not save state', e);
  }
}

function loadFromLocalStorage() {
  if (typeof window === 'undefined') return undefined;
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state', e);
    return undefined;
  }
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
    userPref: userPreferencesReducer,
    search: searchReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
  preloadedState: {
    cart: loadFromLocalStorage(), // Load cart state from localStorage
  },
});

store.subscribe(() => saveToLocalStorage(store.getState().cart));

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
