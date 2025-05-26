import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.imageUrls?.[0] ||
    "https://via.placeholder.com/300x300?text=Sin+Imagen";
    
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    }

  return (
    <div className="group border border-gray-200 rounded-3xl p-3 max-w-[11rem] bg-white hover:shadow-md transition-all duration-300 flex flex-col min-h-[9rem]">
      <div className="h-32 w-full overflow-hidden rounded-2xl mb-2 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="w-[calc(100%+1.5rem)] -mx-3 border-b-3 border-green-700 mb-2" />
      <h2 className="text-sm mb-1 text-center break-words w-full">{product.name}</h2>
      
      <p className="text-green-800 text-base mb-2 text-center">
        {new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(product.price)}
      </p>

      <div className="flex justify-center gap-1 w-full mt-auto transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        <button onClick={handleAddToCart} className="bg-green-700 text-white font-bold rounded-full px-3 py-1.5 shadow-md transition-colors duration-200 hover:bg-green-600 text-[10px]">
          COMPRAR
        </button>
        <Link
          to={`/products/${product.id}`}
          className="border-2 border-green-700 text-green-700 font-bold rounded-full px-3 py-1.5 bg-white transition-colors duration-200 text-[10px] flex items-center gap-1"
        >
          <span>VER</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#016630"
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
