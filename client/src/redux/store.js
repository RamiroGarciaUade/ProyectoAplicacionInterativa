import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import adminReducer from './slices/adminSlice'
import uiReducer from './slices/uiSlice'
import { setupApiInterceptors } from '../services/api'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated']
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['cartItems']
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme']
};

export const store = configureStore({
    reducer: {
        auth: persistReducer(authPersistConfig, authReducer),
        cart: persistReducer(cartPersistConfig, cartReducer),
        products: productReducer,
        orders: orderReducer,
        admin: adminReducer,
        ui: persistReducer(uiPersistConfig, uiReducer),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store);

setupApiInterceptors(store);
