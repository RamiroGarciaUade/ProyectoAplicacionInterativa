import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.imageUrls?.[0] ||
    "https://via.placeholder.com/300x300?text=Sin+Imagen";
    
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
      e.stopPropagation(); // Evita que el click en el botón también active el Link del card
      e.preventDefault();
      if (product.stock > 0) {
        addToCart(product);
        // Opcional: Podrías disparar una notificación global aquí si la implementas en el contexto
        // console.log(`${product.name} agregado al carrito desde ProductCard`);
      }
  }

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = discountPercentage ? parseFloat(discountPercentage) : 0;
    if (numericDiscount > 0) {
      const discountAmount = (numericPrice * numericDiscount) / 100;
      return numericPrice - discountAmount;
    }
    return numericPrice;
  };

  const originalPrice = parseFloat(product.price);
  const discountPercentage = product.discountPercentage ? parseFloat(product.discountPercentage) : 0;
  const effectivePrice = calculateDiscountedPrice(originalPrice, discountPercentage);

  return (
    <div className="group relative border border-gray-200 rounded-lg p-3 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full max-w-[190px] min-h-[320px] overflow-hidden">
      <Link to={`/products/${product.id}`} className="block flex flex-col h-full"> {/* Link envuelve contenido clickeable */}
        <div className="flex-grow"> {/* Contenedor para imagen y texto */}
          <div className="h-40 w-full rounded-md mb-2 flex items-center justify-center relative bg-gray-50 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {discountPercentage > 0 && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow-sm z-10">
                {discountPercentage.toFixed(0)}% OFF
              </span>
            )}
          </div>
          
          <h2 title={product.name} className="text-sm font-medium text-gray-800 text-center break-words w-full h-10 line-clamp-2 hover:text-green-700 overflow-hidden my-1">
            {product.name}
          </h2>
          
          <div className="text-center mb-2 h-12 flex flex-col justify-center items-center">
            {discountPercentage > 0 ? (
              <>
                <p className="text-gray-400 line-through text-xs">
                  {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(originalPrice)}
                </p>
                <p className="text-green-700 text-base font-bold">
                  {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(effectivePrice)}
                </p>
              </>
            ) : (
              <p className="text-green-700 text-base font-bold">
                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Contenedor de botones absolutamente posicionado en la parte inferior, visible en hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white bg-opacity-90 backdrop-blur-sm 
                      opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0
                      flex flex-col items-center gap-2 z-20">
        <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className={`w-full bg-green-600 text-white font-semibold rounded-md px-3 py-2 shadow-md transition-colors duration-200 hover:bg-green-700 text-xs
                        disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}>
          {product.stock === 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
        </button>
        <Link
          to={`/products/${product.id}`}
          className="w-full border border-gray-300 text-gray-700 font-semibold rounded-md px-3 py-2 bg-gray-50 transition-all duration-200 text-xs 
                     flex items-center justify-center gap-1 hover:border-green-600 hover:text-green-700 hover:bg-green-50
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <span>VER DETALLE</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;