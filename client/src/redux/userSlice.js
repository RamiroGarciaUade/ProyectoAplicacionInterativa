import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080";

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Función para configurar axios con el token
const axiosWithAuth = () => {
  const token = getToken();
  return axios.create({
    baseURL: URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post(`${URL}/auth/register`, userData);
      
      // Si el registro es exitoso, guardar el token
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }
      
      return res.data.user || res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error al registrar usuario"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      // 1. Login: obtener el token
      const res = await axios.post(`${URL}/auth/authenticate`, { email, password });
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // 2. Obtener el usuario actual usando el token
      const userRes = await axiosWithAuth().get(`${URL}/users/email/${email}`);
      
      return userRes.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Email o contraseña incorrectos"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (updateData, thunkAPI) => {
    try {
      const res = await axiosWithAuth().put(`${URL}/users/${updateData.id}`, updateData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error al actualizar usuario"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId, thunkAPI) => {
    try {
      await axiosWithAuth().delete(`${URL}/users/${userId}`);
      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error al eliminar usuario"
      );
    }
  }
);

export const getUserByEmail = createAsyncThunk(
  "users/getByEmail",
  async (email, thunkAPI) => {
    try {
      const res = await axiosWithAuth().get(`${URL}/users/email/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error al buscar por email"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getById",
  async (userId, thunkAPI) => {
    try {
      const res = await axiosWithAuth().get(`${URL}/users/${userId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error al buscar usuario"
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosWithAuth().get(`${URL}/users`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error al obtener usuarios"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    users: [],
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.users = [];
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Action para inicializar el usuario desde localStorage si existe
    initializeAuth: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.isAuthenticated = true;
        // Aquí podrías decodificar el token para obtener info básica del usuario
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Registro
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get by Email
      .addCase(getUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, initializeAuth } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectUsers = (state) => state.user.users;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;
