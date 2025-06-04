import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel"; // Importa el carrusel
import { Link } from "react-router-dom";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [veganProducts, setVeganProducts] = useState([]); // Nuevo estado para productos veganos
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [loadingVegan, setLoadingVegan] = useState(true); // Nuevo estado de carga para veganos
  const [errorVegan, setErrorVegan] = useState(null);     // Nuevo estado de error para veganos
  const [randomCategories, setRandomCategories] = useState([]);

  useEffect(() => {
    // Carga de Productos Destacados
    fetch("http://localhost:8080/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setFeaturedProducts(data.slice(0, 4)); // Los primeros 4 como destacados
        setLoadingFeatured(false);

        // Simulación de productos veganos (ajusta la lógica de filtrado según tus datos)
        // Idealmente, tu backend te daría una propiedad 'isVegan' o una 'category'
        const filteredVegan = data.filter(product =>
          product.name.toLowerCase().includes('vegan') ||
          product.description.toLowerCase().includes('vegano')
        );
        setVeganProducts(filteredVegan);
        setLoadingVegan(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setErrorFeatured("No se pudieron cargar los productos destacados.");
        setErrorVegan("No se pudieron cargar los productos veganos.");
        setLoadingFeatured(false);
        setLoadingVegan(false);
      });
  }, []);

  // Cargar categorías y elegir 3 al azar
  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Mezclar y tomar 3
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setRandomCategories(shuffled.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
      });
  }, []);

  return (
    <>
      <Hero />

      {/* Sección de Propuestas de Valor/Banners Pequeños */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-green-800 mb-2">Envíos Rápidos</h3>
              <p className="text-gray-700">Recibe tus productos en la comodidad de tu hogar.</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-green-800 mb-2">Compra Segura</h3>
              <p className="text-gray-700">Tus datos y pagos protegidos con tecnología avanzada.</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-green-800 mb-2">Atención Personalizada</h3>
              <p className="text-gray-700">Estamos aquí para ayudarte en lo que necesites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Merriweather'] font-bold text-green-800 text-center mb-10">
            Productos Destacados
          </h2>
          {loadingFeatured ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="ml-4 text-green-700">Cargando destacados...</p>
            </div>
          ) : errorFeatured ? (
            <div className="text-center text-red-600">
              <p>{errorFeatured}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay productos destacados para mostrar.</p>
          )}
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-block bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* Nuevo Carrusel de Productos Veganos */}
      {loadingVegan ? (
        <div className="py-12 flex justify-center items-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="ml-4 text-green-700">Cargando productos veganos...</p>
        </div>
      ) : errorVegan ? (
        <div className="py-12 text-center text-red-600 bg-white">
          <p>{errorVegan}</p>
        </div>
      ) : (
        <ProductCarousel title="Productos Veganos" products={veganProducts} />
      )}

      {/* Sección de Categorías Populares */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Merriweather'] font-bold text-green-800 text-center mb-10">
            Explora Nuestras Categorías
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {randomCategories.map((cat) => (
              <div key={cat.id} className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">{cat.name}</h3>
                <p className="text-gray-600">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;