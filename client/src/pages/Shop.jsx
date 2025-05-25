import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom"; // Importa useLocation

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Obtiene el objeto location de la URL

  // useEffect se ejecutará cada vez que la URL cambie (por ejemplo, por un nuevo search term)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search"); // Obtiene el valor del parámetro 'search'
    const categoryFilter = queryParams.get("category"); // Obtiene el valor del parámetro 'category'

    let url = "http://localhost:8080/products"; // URL base para todos los productos
    const params = [];

    if (searchTerm) {
      params.push(`name=${encodeURIComponent(searchTerm)}`); // Asume que tu backend busca por 'name'
                                                          // Si tu backend busca por otra propiedad, ajústalo aquí.
    }
    if (categoryFilter) {
      params.push(`category=${encodeURIComponent(categoryFilter)}`); // Asume que tu backend filtra por 'category'
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`; // Concatena los parámetros a la URL
    }

    setIsLoading(true); // Reinicia el estado de carga
    setError(null);     // Limpia cualquier error anterior

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Error al cargar los productos. Intenta de nuevo más tarde.");
        setIsLoading(false);
      });
  }, [location.search]); // Dependencia clave: re-ejecutar cuando los parámetros de URL cambien

  return (
    <>
      <div className="flex items-center justify-center text-green-800 font-bold pt-7">
        <h1>Nuestros Productos</h1> {/* Título de la página de la tienda */}
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="ml-4 text-green-700">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 min-h-[200px]">
              <p>{error}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-4 justify-items-center">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 min-h-[200px]">
              <p>No se encontraron productos que coincidan con tu búsqueda o filtros.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;