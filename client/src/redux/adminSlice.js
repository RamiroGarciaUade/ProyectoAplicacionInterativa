import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const URL = "http://localhost:8080";

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Función para configurar axios con el token
const axiosWithAuth = () => {
  const token = getToken();
  return fetch(`${URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Async thunks para usuarios
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al cargar usuarios"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }

      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al eliminar usuario"
      );
    }
  }
);

// Async thunks para productos
export const fetchAllProducts = createAsyncThunk(
  "admin/fetchAllProducts",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al cargar productos"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al eliminar producto"
      );
    }
  }
);

// Async thunks para categorías
export const fetchAllCategories = createAsyncThunk(
  "admin/fetchAllCategories",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar categorías");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al cargar categorías"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (categoryId, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar categoría");
      }

      return categoryId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al eliminar categoría"
      );
    }
  }
);

// Async thunks para órdenes
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/purchase-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar órdenes");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al cargar órdenes"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${URL}/purchase-orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar estado de la orden");
      }

      return { orderId, status };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Error al actualizar estado de la orden"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    products: [],
    categories: [],
    orders: [],
    loading: {
      users: false,
      products: false,
      categories: false,
      orders: false,
    },
    error: {
      users: null,
      products: null,
      categories: null,
      orders: null,
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.error = {
        users: null,
        products: null,
        categories: null,
        orders: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading.users = true;
        state.error.users = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      // Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      })
      // Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading.categories = true;
        state.error.categories = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error.categories = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      })
      // Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
      });
  },
});

export const { clearErrors } = adminSlice.actions;

// Selectors
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminProducts = (state) => state.admin.products;
export const selectAdminCategories = (state) => state.admin.categories;
export const selectAdminOrders = (state) => state.admin.orders;

export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer; 