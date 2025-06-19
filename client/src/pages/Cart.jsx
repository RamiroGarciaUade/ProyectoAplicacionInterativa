import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Cart = ({ onLoginClick }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      onLoginClick();
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 my-24">
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
          Tu Carrito
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <Link
            to="/shop"
            className="inline-block bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.effectivePrice * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-20">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
        Tu Carrito
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="divide-y divide-green-200">
          {cartItems.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.imageUrls?.[0] || "https://via.placeholder.com/100"
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-green-800 font-medium">
                      {/* Mostrar precio efectivo por unidad */}
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.effectivePrice)} 
                      {item.discountPercentage && item.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(item.price)}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock disponible: {item.stock} unidades
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1, item.stock)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1, item.stock)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Quitar ${item.name} del carrito`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-green-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-green-800">
              {/* Usar totalAmount calculado con effectivePrice */}
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalAmount)}
            </span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;