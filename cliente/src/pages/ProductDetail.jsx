import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:8080/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">Cargando producto...</div>
    );
  }

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-3 mt-2 font-['Montserrat']">
        <nav className="text-sm mt-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-emerald-600 text-gray-500">
                Home
              </Link>
              <svg
                className="fill-current w-3 h-3 mx-3 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center font-['Montserrat']">
              <span>{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <main>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8 mt-4">
          {/* Left: Image and badges */}
          <div className="flex flex-col items-center md:items-center w-full md:w-1/2">
            {/* Badges (if any) */}
            <div className="flex gap-2 mb-2">
              {/* Example badges, replace with real ones if available */}
              {product.badges && product.badges.map((badge, i) => (
                <img key={i} src={badge} alt="badge" className="h-10 w-10 object-contain" />
              ))}
            </div>
            <img
              src={product.imageUrls?.[0] || "https://via.placeholder.com/300x300?text=Sin+Imagen"}
              alt={product.name}
              className="rounded-lg object-cover w-72 h-72 bg-gray-50"
            />
          </div>

          {/* Right: Info and actions */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-gray-800">{product.name}</h1>
              <div className="text-lg text-gray-600 mb-4">{product.description}</div>
              <div className="text-xl font-semibold text-emerald-700 mb-4">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4 ">
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1">
                <button
                  className="px-2 py-2 text-sm font-bold rounded cursor-pointer"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="text-lg  w-8 text-center">{quantity}</span>
                <button
                  className="px-2 text-lg font-bold rounded cursor-pointer"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <button 
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }
              }}
              className="ml-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 px-6 rounded-full transition-colors cursor-pointer">
                AGREGAR AL CARRITO
              </button>
            </div>
            <div className="border-t pt-4 mt-4 text-sm text-gray-500">
              <div className="mb-2">Medios de envío</div>
              <input
                type="text"
                placeholder="Tu código postal"
                className="border rounded px-2 py-1 mr-2"
              />
              <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">CALCULAR</button>
              <div className="mt-2">Retiro en local: Gratis</div>
              <div className="mt-1">Consultas por WhatsApp</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
