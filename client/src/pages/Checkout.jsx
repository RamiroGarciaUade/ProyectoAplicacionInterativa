import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { token, user } = useAuth();
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    console.log('Datos del usuario:', {
      user,
      address: user?.address,
      firstName: user?.firstName,
      lastName: user?.lastName,
      hasAllFields: Boolean(user?.address && user?.firstName && user?.lastName)
    });
  }, [user]);

  const [addressFormData, setAddressFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address || "",
  });

  const [paymentFormData, setPaymentFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    console.log('Verificando dirección predeterminada:', {
      hasAddress: Boolean(user?.address),
      hasFirstName: Boolean(user?.firstName),
      hasLastName: Boolean(user?.lastName),
      allFieldsPresent: Boolean(user?.address && user?.firstName && user?.lastName)
    });

    if (user?.address && user?.firstName && user?.lastName) {
      setUseDefaultAddress(true);
      setAddressFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
  }, [user]);

  const handleDefaultAddressChange = (e) => {
    const isChecked = e.target.checked;
    setUseDefaultAddress(isChecked);
    
    if (isChecked && user) {
      setAddressFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    } else {
      setAddressFormData({
        firstName: "",
        lastName: "",
        address: "",
      });
    }
  };

  useEffect(() => {
    const validateForms = () => {
      const isPaymentValid = 
        paymentFormData.cardName &&
        paymentFormData.cardNumber.replace(/\s/g, '').length === 16 &&
        paymentFormData.expiry.length === 5 &&
        paymentFormData.cvv.length === 3;

      const isAddressValid = useDefaultAddress ? 
        Boolean(user?.address && user?.firstName && user?.lastName) : 
        (addressFormData.firstName &&
         addressFormData.lastName &&
         addressFormData.address);

      console.log('Validación de formularios:', {
        isPaymentValid,
        isAddressValid,
        useDefaultAddress,
        userFields: {
          address: user?.address,
          firstName: user?.firstName,
          lastName: user?.lastName
        },
        formFields: addressFormData
      });

      setIsFormValid(isPaymentValid && isAddressValid);
    };

    validateForms();
  }, [useDefaultAddress, addressFormData, paymentFormData, user]);

  const handleCheckout = async () => {
    if (!token) {
      console.error("Usuario no autenticado. Redirigiendo a login...");
      navigate("/");
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: useDefaultAddress ? user.address : addressFormData.address,
        paymentMethod: {
          type: "CREDIT_CARD",
          cardNumber: paymentFormData.cardNumber.replace(/\s/g, ''),
          expiryDate: paymentFormData.expiry,
        },
      };

      const response = await fetch("http://localhost:8080/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error al procesar la orden:', errorData?.message || response.statusText);
        throw new Error(errorData?.message || "Error al procesar la orden");
      }

      const data = await response.json();
      const orderIdMatch = data.message.match(/Orden de compra número: (\d+)/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;
      
      console.log('Orden creada exitosamente:', orderId || data.message);
      
      clearCart();
      navigate("/success", { 
        state: { orderId }
      });
    } catch (error) {
      console.error("Error en el checkout:", error.message);
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

  const hasDefaultAddress = Boolean(user?.address && user?.firstName && user?.lastName);

  console.log('Estado final:', {
    hasDefaultAddress,
    useDefaultAddress,
    userData: {
      address: user?.address,
      firstName: user?.firstName,
      lastName: user?.lastName
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8">
        Finalizar Compra
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Resumen del carrito */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Carrito</h2>
          <div className="divide-y divide-green-200">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageData
                        ? `data:${item.imageType};base64,${item.imageData}`
                        : "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x300/EBF5FB/17202A?text=Error";
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-green-800 font-medium">
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
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-green-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Envío a domicilio</h3>
                    <p className="text-green-600 font-medium">¡Gratis!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-green-600">$0</p>
                </div>
              </div>
            </div>
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
                }).format(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="useDefaultAddress"
                checked={useDefaultAddress}
                onChange={handleDefaultAddressChange}
                disabled={!hasDefaultAddress}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="useDefaultAddress" className="ml-2 block text-sm text-gray-900">
                {hasDefaultAddress 
                  ? "Usar dirección predeterminada para la entrega"
                  : "No tienes una dirección predeterminada configurada"}
              </label>
            </div>
            
            {!useDefaultAddress && (
              <AddressForm
                formData={addressFormData}
                setFormData={setAddressFormData}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Método de Pago</h2>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  checked={true}
                  readOnly
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="creditCard" className="ml-2 block text-sm text-gray-900">
                  Tarjeta de crédito (VISA / Mastercard)
                </label>
              </div>
            </div>
            
            <PaymentForm
              formData={paymentFormData}
              setFormData={setPaymentFormData}
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-lg transition-colors ${
              isFormValid
                ? "bg-green-800 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;