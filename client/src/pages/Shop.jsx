import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation, useNavigate } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { // busca todas las categorias al montar el componente
    fetch("http://localhost:8080/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSortChange = (sortType) => {
    const queryParams = new URLSearchParams(location.search);
    if (sortType === "") {
      queryParams.delete("sort");
    } else {
      queryParams.set("sort", sortType);
    }
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");
    const sortType = queryParams.get("sort");

    let url = "http://localhost:8080/products";
    
    // si hay categorias seleccionadas, busca los productos para cada categoria
    if (selectedCategories.length > 0) {
      Promise.all(
        selectedCategories.map(categoryId =>
          fetch(`http://localhost:8080/products/category/${categoryId}`)
            .then(res => res.json())
        )
      )
        .then(results => {
          // elimina duplicados
          const allProducts = results.flat();
          const uniqueProducts = Array.from(
            new Map(allProducts.map(product => [product.id, product])).values()
          );
          
          // si hay un tipo de ordenamiento, ordena los productos
          if (sortType) {
            uniqueProducts.sort((a, b) => {
              switch (sortType) {
                case "name_asc":
                  return a.name.localeCompare(b.name);
                case "name_desc":
                  return b.name.localeCompare(a.name);
                case "price_asc":
                  return parseFloat(a.price) - parseFloat(b.price);
                case "price_desc":
                  return parseFloat(b.price) - parseFloat(a.price);
                default:
                  return 0;
              }
            });
          }
          
          setProducts(uniqueProducts);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching products:", err);
          setError("Error al cargar los productos. Intenta de nuevo más tarde.");
          setIsLoading(false);
        });
    } else if (searchTerm) {
      // si no hay categorias seleccionadas pero hay un termino de busqueda
      url = `http://localhost:8080/products/search/${encodeURIComponent(searchTerm)}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          let productsData = Array.isArray(data) ? data : [data];
          setProducts(productsData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setError("Error al cargar los productos. Intenta de nuevo más tarde.");
          setIsLoading(false);
        });
    } else {
      // si no hay filtros, busca todos los productos
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          let productsData = Array.isArray(data) ? data : [data];
          
          // si hay un tipo de ordenamiento, ordena los productos
          if (sortType) {
            productsData.sort((a, b) => {
              switch (sortType) {
                case "name_asc":
                  return a.name.localeCompare(b.name);
                case "name_desc":
                  return b.name.localeCompare(a.name);
                case "price_asc":
                  return parseFloat(a.price) - parseFloat(b.price);
                case "price_desc":
                  return parseFloat(b.price) - parseFloat(a.price);
                default:
                  return 0;
              }
            });
          }
          
          setProducts(productsData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setError("Error al cargar los productos. Intenta de nuevo más tarde.");
          setIsLoading(false);
        });
    }
  }, [location.search, selectedCategories]);

  return (
    <div className="container mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center justify-center text-green-800 font-bold">
        <h1>Nuestros Productos</h1>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-lg p-4 mb-6">
        <div className="flex justify-end">
          
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={new URLSearchParams(location.search).get("sort") || ""}
            >
              <option value="">Sin ordenar</option>
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="name_desc">Nombre (Z-A)</option>
              <option value="price_asc">Precio (menor a mayor)</option>
              <option value="price_desc">Precio (mayor a menor)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <div className="w-56 bg-white p-4 rounded-lg shadow-md h-fit">
            <h3 className="text-lg font-bold mb-4 text-green-800">Categorías</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-1 justify-items-center">
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
      </div>
    </div>
  );
};

export default Shop;