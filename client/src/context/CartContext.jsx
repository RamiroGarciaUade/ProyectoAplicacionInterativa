import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const calculateEffectivePrice = (product) => {
  const originalPrice = parseFloat(product.price);
  const discountPercentage = product.discountPercentage ? parseFloat(product.discountPercentage) : 0;
  if (discountPercentage > 0) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discountAmount;
  }
  return originalPrice;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // Estados para la notificación global
  const [notification, setNotification] = useState({
    show: false,
    productName: '',
    productImage: '',
    productPrice: 0,
    quantityAdded: 0,
  });

  const addToCart = (product, quantity = 1) => {
    const effectivePrice = calculateEffectivePrice(product);
    let itemAddedOrUpdated = false;

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const currentItem = updatedItems[existingItemIndex];
        const newQuantity = currentItem.quantity + quantity;

        if (newQuantity <= product.stock) {
          updatedItems[existingItemIndex] = { 
            ...currentItem, 
            quantity: newQuantity, 
            effectivePrice // Podría ser redundante si el precio no cambia, pero por si acaso
          };
          itemAddedOrUpdated = true;
          return updatedItems;
        } else {
          // No se puede agregar más que el stock disponible
          // Opcional: mostrar una alerta/notificación de stock insuficiente
          console.warn(`No se puede agregar más de ${product.name}. Stock disponible: ${product.stock}`);
          return prevItems; // No se modifica el carrito
        }
      } else {
        if (quantity <= product.stock && product.stock > 0) {
          itemAddedOrUpdated = true;
          return [...prevItems, { ...product, quantity, effectivePrice }];
        } else {
          // No se puede agregar si no hay stock o la cantidad inicial excede el stock
          console.warn(`No se puede agregar ${product.name}. Stock disponible: ${product.stock}`);
          return prevItems;
        }
      }
    });

    if (itemAddedOrUpdated) {
      setNotification({
        show: true,
        productName: product.name,
        productImage: product.imageUrls?.[0] || "https://via.placeholder.com/100",
        productPrice: effectivePrice,
        quantityAdded: quantity,
      });
      // El componente de notificación se encargará de ocultarse
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity, stock) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stock) newQuantity = stock; 
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount, // Exponer el conteo
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        notification, // Exponer el estado de la notificación
        closeNotification // Exponer la función para cerrar
      }}
    >
      {children}
    </CartContext.Provider>
  );
};