import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "../redux/cartSlice";
import { selectUser } from "../redux/userSlice";
import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
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
    const token = localStorage.getItem("token");
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
      
      dispatch(clearCart());
      navigate("/success", { 
        state: { orderId }
      });
    } catch (error) {
      console.error("Error en el checkout:", error.message);
    }
  };

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
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={e => {
                        if (e.target.src !== "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen") {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen";
                        }
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-green-800 font-medium">
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
              </div>
            ))}
          </div>
          <div className="border-t border-green-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
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

        {/* Columna derecha - Formularios */}
        <div className="space-y-6">
          {/* Dirección de envío */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dirección de Envío</h2>
            
            {hasDefaultAddress && (
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useDefaultAddress}
                    onChange={handleDefaultAddressChange}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Usar mi dirección guardada
                  </span>
                </label>
              </div>
            )}

            {useDefaultAddress ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Nombre:</strong> {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Dirección:</strong> {user.address}
                </p>
              </div>
            ) : (
              <AddressForm
                formData={addressFormData}
                setFormData={setAddressFormData}
              />
            )}
          </div>

          {/* Información de pago */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Pago</h2>
            <PaymentForm
              formData={paymentFormData}
              setFormData={setPaymentFormData}
            />
          </div>

          {/* Botón de finalizar compra */}
          <button
            onClick={handleCheckout}
            disabled={!isFormValid}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isFormValid
                ? "bg-green-800 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;