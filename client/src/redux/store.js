import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./categoriesSlice"; // Assuming you have a categoriesSlice.js file
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productReducer,
    cart: cartReducer,
    user: userReducer,
    admin: adminReducer,
  },
});
