import { useState } from "react";

const ShoppingCartIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    ></path>
  </svg>
);

const ProductCardDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const imageUrl =
    product.imageUrls?.[0] ||
    "https://via.placeholder.com/300x300?text=Sin+Imagen";
  // Calculate price per kg or unit if applicable
  const pricePerKg =
    product.price && product.weightInGrams
      ? (product.price / (product.weightInGrams / 1000)).toFixed(2)
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md h-80 md:h-96   rounded-lg flex items-center justify-center mb-4 shadow-md overflow-hidden">
            <img src={imageUrl} alt="Descripción de la imagen" />
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:w-1/2">
          <div className="flex justify-between items-start mb-5">
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          </div>

          {product.weightInGrams && (
            <p className="text-sm mb-3">
              {product.weightInGrams}g
              {pricePerKg && <span className="ml-1">(${pricePerKg}/Kg)</span>}
            </p>
          )}

          <div className="mb-6">
            <span className="text-3xl font-bold text-green-600 mr-3">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(product.price)}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold  mb-1">Descripcion</h3>
            <p className=" leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium  dark:text-gray-300">
              Quantity:
            </span>
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100  focus:outline-none focus:ring-1 focus:ring-emerald-500"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly // Or use onChange for direct input, with validation
              className="w-12 text-center border-t border-b border-gray-300 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              +
            </button>
          </div>

          <button className="w-full bg-green-800 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center text-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
            <ShoppingCartIcon className="w-6 h-6 mr-2" />
            AGREGAR AL CARRITO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDetail;
