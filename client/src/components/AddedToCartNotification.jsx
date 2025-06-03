import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AddedToCartNotification = ({ productName, productImage, productPrice, cartItemCount, quantityAdded = 1, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Inicia la animación de entrada

    const visibilityTimer = setTimeout(() => {
      setIsVisible(false); // Inicia la animación de salida
    }, 3000); // Comienza a desaparecer a los 3 segundos

    const closeTimer = setTimeout(() => {
      onClose(); // Llama a onClose después de que la animación de salida pueda completarse
    }, 3300); // Cierra completamente después de 3.3 segundos (300ms para la animación de salida)

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]); // El efecto solo se re-ejecuta si onClose cambia (lo cual no debería)

  return (
    <div 
      className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 bg-white p-4 rounded-lg shadow-2xl z-[100] w-[calc(100%-2.5rem)] max-w-sm 
                  transition-all duration-300 ease-out
                  ${isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        {productImage && (
          <img src={productImage} alt={productName} className="w-14 h-14 object-cover rounded-md mr-3 flex-shrink-0 border border-gray-200" />
        )}
        <div className="flex-grow overflow-hidden min-w-0"> {/* Ayuda con el truncado */}
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-green-600 mb-0.5">
              {quantityAdded > 1 ? `${quantityAdded} x ` : ''}¡Agregado al carrito!
            </p>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 p-0.5 -mt-1 -mr-1 transition-colors" 
                aria-label="Cerrar notificación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h4 title={productName} className="font-semibold text-gray-800 text-sm truncate leading-tight">
            {productName}
          </h4>
          <p className="text-gray-700 font-semibold text-xs">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(productPrice)}
          </p>
        </div>
      </div>
      {cartItemCount > 0 && (
          <p className="text-xs text-gray-500 mt-2 mb-2 pl-1">
            Subtotal ({cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}): {/* Aquí podrías mostrar el subtotal del carrito si lo pasas */}
          </p>
      )}
      <Link 
        to="/cart" 
        onClick={onClose}
        className="block w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-2 px-4 rounded-md transition-colors text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        VER CARRITO
      </Link>
    </div>
  );
};

export default AddedToCartNotification;