import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation, useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // busca todas las categorias al montar el componente
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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");
    const sortType = queryParams.get("sort");

    let url = "http://localhost:8080/products";

    // si hay categorias seleccionadas, busca los productos para cada categoria
    if (selectedCategories.length > 0) {
      Promise.all(
        selectedCategories.map((categoryId) =>
          fetch(`http://localhost:8080/products/category/${categoryId}`).then(
            (res) => res.json()
          )
        )
      )
        .then((results) => {
          // elimina duplicados
          const allProducts = results.flat();
          const uniqueProducts = Array.from(
            new Map(
              allProducts.map((product) => [product.id, product])
            ).values()
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
        .catch((err) => {
          console.error("Error fetching products:", err);
          setError(
            "Error al cargar los productos. Intenta de nuevo más tarde."
          );
          setIsLoading(false);
        });
    } else if (searchTerm) {
      // si no hay categorias seleccionadas pero hay un termino de busqueda
      url = `http://localhost:8080/products/name/${encodeURIComponent(
        searchTerm
      )}`;
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
          setError(
            "Error al cargar los productos. Intenta de nuevo más tarde."
          );
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
          setError(
            "Error al cargar los productos. Intenta de nuevo más tarde."
          );
          setIsLoading(false);
        });
    }
  }, [location.search, selectedCategories]);
};
