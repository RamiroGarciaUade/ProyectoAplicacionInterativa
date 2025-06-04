import React from "react";
import { useCart } from "../context/CartContext"; // Asegúrate que la ruta sea correcta
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl = product.imageData
    ? `data:${product.imageType};base64,${product.imageData}`
    : "https://placehold.co/300x300/EBF5FB/17202A?text=Sin+Imagen";

  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que el click en el botón también active el Link del card
    e.preventDefault(); // Evita la navegación si el botón está dentro de un Link
    if (product.stock > 0) {
      addToCart(product);
      // Opcional: Aquí podrías disparar una notificación global
      // console.log(`${product.name} agregado al carrito.`);
    }
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = discountPercentage
      ? parseFloat(discountPercentage)
      : 0;
    if (numericDiscount > 0) {
      const discountAmount = (numericPrice * numericDiscount) / 100;
      return numericPrice - discountAmount;
    }
    return numericPrice;
  };

  const originalPrice = parseFloat(product.price);
  const discountPercentage = product.discountPercentage
    ? parseFloat(product.discountPercentage)
    : 0;
  const effectivePrice = calculateDiscountedPrice(
    originalPrice,
    discountPercentage
  );

  return (
    <div className="group relative border border-gray-200 rounded-lg p-3 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full max-w-[190px] min-h-[320px] overflow-hidden">
      {/* Link que envuelve la mayor parte de la tarjeta, excepto los botones que aparecerán al hacer hover */}
      <Link
        to={`/products/${product.id}`}
        className="block flex flex-col h-full mb-6"
      >
        {" "}
        {/* Añadido mb-12 para dejar espacio a los botones */}
        <div className="flex-grow">
          {" "}
          {/* Contenedor para imagen y texto */}
          <div className="h-40 w-full rounded-md mb-2 flex items-center justify-center relative bg-gray-50 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null; // Previene loop si el placeholder también falla
                e.target.src =
                  "https://placehold.co/300x300/EBF5FB/17202A?text=Error";
              }}
            />
            {discountPercentage > 0 && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow-sm z-10">
                {discountPercentage.toFixed(0)}% OFF
              </span>
            )}
          </div>
          <h2
            title={product.name}
            className="text-sm font-medium text-gray-800 text-center break-words w-full h-10 line-clamp-2 hover:text-green-700 overflow-hidden my-1"
          >
            {product.name}
          </h2>
          {product.weightInGrams && (
            <p className="text-[10px] text-gray-500 mb-1 text-center">
              {product.weightInGrams}g
            </p>
          )}
          <div className="text-center mb-2 h-12 flex flex-col justify-center items-center">
            {discountPercentage > 0 ? (
              <>
                <p className="text-gray-400 line-through text-xs">
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(originalPrice)}
                </p>
                <p className="text-green-700 text-base font-bold">
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(effectivePrice)}
                </p>
              </>
            ) : (
              <p className="text-green-700 text-base font-bold">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Contenedor de botones con estilo del código 1, posicionado absolutamente en la parte inferior */}
      {/* Se muestra al hacer hover en la tarjeta (group-hover) */}
      <div
        className="absolute bottom-0 left-0 right-0 p-3 bg-white 
                   opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto 
                   transition-all duration-300 transform translate-y-full group-hover:translate-y-0
                   flex justify-center gap-1 w-full z-20"
      >
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="bg-green-700 text-white font-bold rounded-full px-3 py-1.5 shadow-md transition-colors duration-200 hover:bg-green-600 text-[10px] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          {product.stock === 0 ? "SIN STOCK" : "AGREGAR"}
        </button>
        <Link
          to={`/products/${product.id}`}
          onClick={(e) => e.stopPropagation()} // Para que el Link del botón no interfiera con el Link de la tarjeta si es necesario, aunque al estar fuera no debería.
          className="border-2 border-green-800 text-green-800 font-bold rounded-full px-3 py-1.5 bg-white transition-colors duration-200 text-[10px] flex items-center gap-1 hover:border-green-600 hover:text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <span>VER</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor" // Cambiado a currentColor para que herede el color del texto
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
