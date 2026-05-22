import { createAPI } from './createAPI';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import templateReducer from './templateSlice';
import estimateReducer from "./estimateSlice"
import subscriptionReducer from "./subscriptionSlice";
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storageSession from 'redux-persist/lib/storage/session';
import type { PersistConfig } from 'redux-persist';

const rootReducer = combineReducers({
  [createAPI.reducerPath]: createAPI.reducer,
  auth: authReducer,
  template: templateReducer, 
  estimate: estimateReducer,
  subscription: subscriptionReducer,
});

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage: storageSession,
  whitelist: ['auth','template',"estimate"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(createAPI.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
