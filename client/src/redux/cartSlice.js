import { createSlice } from "@reduxjs/toolkit";

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { items: [], total: 0 };
  }
};

// guardar el carrito en localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Función para calcular el precio efectivo (con descuento si aplica)
const calculateEffectivePrice = (product) => {
  if (product.discountPercentage && product.discountPercentage > 0) {
    return product.price * (1 - product.discountPercentage / 100);
  }
  return product.price;
};

// Función para calcular el total del carrito
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.effectivePrice * item.quantity);
  }, 0);
};

// Función para obtener la URL de imagen del producto
const getProductImageUrl = (product) => {
  if (product.imageData && product.imageType) {
    return `data:${product.imageType};base64,${product.imageData}`;
  } else if (product.imageUrls && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  } else if (product.image) {
    return product.image;
  }
  return "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen";
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage().items || [],
    total: loadCartFromStorage().total || 0,
    notification: {
      show: false,
      message: "",
      type: "success", // success, error, warning
      productImage: null,
      productPrice: null,
      quantityAdded: 1,
    },
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const effectivePrice = calculateEffectivePrice(product);
      const imageUrl = getProductImageUrl(product);
      
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.stock) {
          existingItem.quantity = newQuantity;
          existingItem.effectivePrice = effectivePrice;
          state.notification = {
            show: true,
            message: `Cantidad actualizada: ${product.name}`,
            type: "success",
            productImage: imageUrl,
            productPrice: effectivePrice,
            quantityAdded: quantity,
          };
        } else {
          state.notification = {
            show: true,
            message: `No hay suficiente stock para ${product.name}`,
            type: "error",
            productImage: null,
            productPrice: null,
            quantityAdded: 0,
          };
          return;
        }
      } else {
        if (quantity <= product.stock) {
          state.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            effectivePrice: effectivePrice,
            discountPercentage: product.discountPercentage || 0,
            quantity: quantity,
            stock: product.stock,
            imageUrl: imageUrl,
            imageData: product.imageData,
            imageType: product.imageType,
            imageUrls: product.imageUrls,
            categoryId: product.categoryId,
          });
          state.notification = {
            show: true,
            message: `${product.name} agregado al carrito`,
            type: "success",
            productImage: imageUrl,
            productPrice: effectivePrice,
            quantityAdded: quantity,
          };
        } else {
          state.notification = {
            show: true,
            message: `No hay suficiente stock para ${product.name}`,
            type: "error",
            productImage: null,
            productPrice: null,
            quantityAdded: 0,
          };
          return;
        }
      }

      state.total = calculateTotal(state.items);
      saveCartToStorage({ items: state.items, total: state.total });
    },

    updateQuantity: (state, action) => {
      const { productId, newQuantity, stock } = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item) {
        if (newQuantity <= 0) {
          state.items = state.items.filter((item) => item.id !== productId);
          state.notification = {
            show: true,
            message: `${item.name} eliminado del carrito`,
            type: "success",
            productImage: null,
            productPrice: null,
            quantityAdded: 0,
          };
        } else if (newQuantity <= stock) {
          item.quantity = newQuantity;
          state.notification = {
            show: true,
            message: `Cantidad actualizada: ${item.name}`,
            type: "success",
            productImage: item.imageUrl,
            productPrice: item.effectivePrice,
            quantityAdded: 1,
          };
        } else {
          state.notification = {
            show: true,
            message: `No hay suficiente stock para ${item.name}`,
            type: "error",
            productImage: null,
            productPrice: null,
            quantityAdded: 0,
          };
          return;
        }

        state.total = calculateTotal(state.items);
        saveCartToStorage({ items: state.items, total: state.total });
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      
      if (item) {
        state.items = state.items.filter((item) => item.id !== productId);
        state.total = calculateTotal(state.items);
        saveCartToStorage({ items: state.items, total: state.total });
        
        state.notification = {
          show: true,
          message: `${item.name} eliminado del carrito`,
          type: "success",
          productImage: null,
          productPrice: null,
          quantityAdded: 0,
        };
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      saveCartToStorage({ items: [], total: 0 });
      
      state.notification = {
        show: true,
        message: "Carrito vaciado",
        type: "success",
        productImage: null,
        productPrice: null,
        quantityAdded: 0,
      };
    },

    closeNotification: (state) => {
      state.notification.show = false;
    },

    // Action para limpiar notificaciones automáticamente después de un tiempo
    clearNotificationAfterDelay: (state) => {
      state.notification.show = false;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  closeNotification,
  clearNotificationAfterDelay,
} = cartSlice.actions;

// Selectors para facilitar el acceso al estado
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartNotification = (state) => state.cart.notification;
export const selectCartIsEmpty = (state) => state.cart.items.length === 0;

export default cartSlice.reducer;
