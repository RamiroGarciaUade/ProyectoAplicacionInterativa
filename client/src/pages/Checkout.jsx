import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();

  const handleCheckout = async () => {
    if (!token) {
      // Idealmente, esto se manejaría con ProtectedRoute, pero como fallback:
      console.error("Usuario no autenticado. Redirigiendo a login...");
      // Aquí podrías llamar a una función para mostrar el modal de login o redirigir.
      navigate("/"); // O a una página de login si la tienes como ruta
      return;
    }

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
            // El backend calculará el subtotal basado en el precio del producto (con descuento si aplica) en el momento de la creación de la orden.
            // No es necesario enviar el `effectivePrice` aquí, ya que el backend lo recalcula.
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error al procesar la orden:', errorData?.message || response.statusText);
        throw new Error(errorData?.message || "Error al procesar la orden");
      }

      const data = await response.json();
      // Asumiendo que el backend devuelve un mensaje como "Orden de compra número: XYZ creada con éxito"
      const orderIdMatch = data.message.match(/Orden de compra número: (\d+)/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;
      
      console.log('Orden creada exitosamente:', orderId || data.message);
      
      clearCart();
      navigate("/success", { 
        state: { orderId }
      });
    } catch (error) {
      console.error("Error en el checkout:", error.message);
      // Aquí podrías mostrar un mensaje de error al usuario en la UI
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.effectivePrice * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Tu carrito está vacío</h1>
        <button onClick={() => navigate('/shop')} className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600">
          Volver a la tienda
        </button>
      </div>
    );
  }

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
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {/* Mostrar subtotal del ítem usando effectivePrice */}
                  <p className="text-lg font-medium text-green-800">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(item.effectivePrice * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-green-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            {/* Usar totalAmount calculado con effectivePrice */}
            <span className="text-2xl font-bold text-green-800">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalAmount)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            disabled={cartItems.length === 0} // Deshabilitar si el carrito está vacío
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;