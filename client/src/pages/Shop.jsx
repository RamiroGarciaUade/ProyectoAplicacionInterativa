import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/categoriesSlice";
import { fetchProductsWithFilters } from "../redux/productSlice";

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  // Categorías desde Redux
  const {
    all: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  // Productos desde Redux
  const {
    filtered: products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);

  // Cargar categorías al montar el componente
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
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

  // Cargar productos cuando cambien los filtros o la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");
    const sortType = queryParams.get("sort");

    dispatch(fetchProductsWithFilters({
      searchTerm,
      selectedCategories,
      sortType
    }));
  }, [location.search, selectedCategories, dispatch]);

  const isLoading = categoriesLoading || productsLoading;
  const error = categoriesError || productsError;

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1"></div>
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 text-center flex-1">
          Nuestros Productos
        </h1>
        <div className="w-48 flex-1 flex justify-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
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
            <h3 className="text-lg font-bold mb-4 text-green-800">
              Categorías
            </h3>
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

          <div className="flex-1 ml-6 relative">
            {/* Mostrar productos anteriores mientras carga (si existen) */}
            {products && products.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-1 justify-items-center">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Overlay de carga sobre los productos existentes */}
                {productsLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                      <p className="ml-3 text-green-700 text-sm">Actualizando productos...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : isLoading ? (
              // Solo mostrar loader si no hay productos previos
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                <p className="ml-4 text-green-700">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 min-h-[200px]">
                <p>{error}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">
                  No se encontraron productos que coincidan con tu búsqueda o
                  filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
