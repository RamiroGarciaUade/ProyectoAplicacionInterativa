const ProductCard = ({ product }) => {
  const imageUrl =
    product.imageUrls?.[0] ||
    "https://via.placeholder.com/300x300?text=Sin+Imagen";

  return (
    <div className="group border border-gray-200 rounded-3xl shadow-sm p-4 max-w-[17rem] bg-white hover:shadow-md transition-all duration-300 flex flex-col items-center min-h-[11rem]">
      <div className="h-40 w-full overflow-hidden rounded-2xl mb-3 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="w-full border-b-4 border-green-800 mb-3" />
      <h2 className="text-lg mb-1 text-center truncate">{product.name}</h2>
      {product.weightInGrams && (
        <p className="text-xs text-gray-500 mb-1 text-center">
          {product.weightInGrams}g
        </p>
      )}
      <p className="text-green-800 text-xl mb-3 text-center">
        {new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(product.price)}
      </p>

      <div className="flex justify-center gap-1 w-full mt-auto transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        <button className="bg-green-700 text-white font-bold rounded-full px-4 py-2 shadow-md transition-colors duration-200 hover:bg-green-600 text-xs">
          COMPRAR
        </button>
        <button className="border-2 border-green-800 text-green-800 font-bold rounded-full px-4 py-2 bg-white transition-colors duration-200 text-xs flex items-center gap-1">
          <span>VER</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#016630"
            className="w-4 h-4"
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
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
