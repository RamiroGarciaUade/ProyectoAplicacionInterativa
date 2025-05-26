import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:8080/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error al procesar la orden:', errorData?.message || response.statusText);
        throw new Error(errorData?.message || "Error al procesar la orden");
      }

      const data = await response.json();
      const orderId = data.message.split(": ")[1];
      console.log('Orden creada exitosamente:', orderId);
      
      clearCart();
      navigate("/success", { 
        state: { orderId }
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
        Finalizar Compra
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="divide-y divide-green-200">
          {cartItems.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrls?.[0] || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-green-800 font-medium">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-green-800">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-green-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-green-800">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )
              )}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 