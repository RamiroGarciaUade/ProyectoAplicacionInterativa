import React from "react";

const Cart = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
        Tu Carrito
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Tu carrito está vacío</p>
      </div>
    </div>
  );
};

export default Cart;
