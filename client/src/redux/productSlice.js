import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080";

// Async thunk para cargar todos los productos
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${URL}/products`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("No se pudieron cargar los productos");
    }
  }
);

// Async thunk para buscar productos
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchTerm, thunkAPI) => {
    try {
      const response = await axios.get(`${URL}/products/search/${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error al buscar productos");
    }
  }
);

// Async thunk para obtener productos por categoría
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId, thunkAPI) => {
    try {
      const response = await axios.get(`${URL}/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error al cargar productos de la categoría");
    }
  }
);

// Async thunk para obtener productos con filtros y ordenamiento
export const fetchProductsWithFilters = createAsyncThunk(
  "products/fetchProductsWithFilters",
  async ({ searchTerm, selectedCategories, sortType }, thunkAPI) => {
    try {
      let products = [];

      // Si hay término de búsqueda y categorías seleccionadas
      if (searchTerm && selectedCategories.length > 0) {
        const searchResponse = await axios.get(`${URL}/products/search/${encodeURIComponent(searchTerm)}`);
        let searchData = Array.isArray(searchResponse.data) ? searchResponse.data : [searchResponse.data];
        
        // Filtrar por categorías seleccionadas
        products = searchData.filter(product => selectedCategories.includes(product.categoryId));
      }
      // Si solo hay categorías seleccionadas
      else if (selectedCategories.length > 0) {
        const categoryPromises = selectedCategories.map(categoryId =>
          axios.get(`${URL}/products/category/${categoryId}`).then(res => res.data)
        );
        
        const results = await Promise.all(categoryPromises);
        const allProducts = results.flat();
        
        // Eliminar duplicados
        products = Array.from(
          new Map(allProducts.map(product => [product.id, product])).values()
        );
      }
      // Si solo hay término de búsqueda
      else if (searchTerm) {
        const searchResponse = await axios.get(`${URL}/products/search/${encodeURIComponent(searchTerm)}`);
        products = Array.isArray(searchResponse.data) ? searchResponse.data : [searchResponse.data];
      }
      // Si no hay filtros, obtener todos los productos
      else {
        const response = await axios.get(`${URL}/products`);
        products = response.data;
      }

      // Aplicar ordenamiento si se especifica
      if (sortType) {
        products.sort((a, b) => {
          switch (sortType) {
            case "name_asc":
              return a.name.localeCompare(b.name);
            case "name_desc":
              return b.name.localeCompare(a.name);
            case "price_asc":
              return parseFloat(a.price) - parseFloat(b.price);
            case "price_desc":
              return parseFloat(b.price) - parseFloat(a.price);
            default:
              return 0;
          }
        });
      }

      return products;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error al cargar productos con filtros");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    all: [],
    filtered: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.all = [];
      state.filtered = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
        state.filtered = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // searchProducts
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filtered = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filtered = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductsWithFilters
      .addCase(fetchProductsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.filtered = action.payload;
      })
      .addCase(fetchProductsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts, clearError } = productSlice.actions;
export default productSlice.reducer;
