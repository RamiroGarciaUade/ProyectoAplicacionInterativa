import React, { useState, useEffect } from "react";
import ProductCardDetail from "../components/ProductCardDetail"; // Assuming ProductCard.jsx is in the same folder
import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

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

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-3 mt-2 font-['Montserrat']">
        {" "}
        <nav className="text-sm mt-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-emerald-600 text-gray-500">
                Home
              </Link>{" "}
              <svg
                className="fill-current w-3 h-3 mx-3 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            {/* Example: If you have a category page before product
            <li className="flex items-center">
              <a href="/almacen" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600">Almacén</a>
              <svg className="fill-current w-3 h-3 mx-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            */}
            <li className="flex items-center font-['Montserrat']">
              <span>{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <main>
        <ProductCardDetail product={product} />
      </main>
    </div>
  );
};

export default ProductDetail;
