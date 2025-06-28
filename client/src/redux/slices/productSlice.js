import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/products', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener productos');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get(`/products/${productId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el producto');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/categories', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener categorías');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get(`/products/category/${categoryId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener productos por categoría');
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc'
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentProduct, 
  setFilter, 
  clearFilters 
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;

export default productSlice.reducer; 