import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "-";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés borrar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al borrar producto");
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800 font-['Merriweather']">Panel de Productos</h1>
        <button
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
          onClick={() => navigate("/admin/products/new")}
        >
          Crear producto
        </button>
      </div>
      <table className="w-full border rounded-lg bg-white">
        <thead>
          <tr className="bg-green-100">
            <th className="py-2 px-4 text-left font-semibold">ID</th>
            <th className="py-2 px-4 text-left font-semibold">Nombre</th>
            <th className="py-2 px-4 text-left font-semibold">Precio</th>
            <th className="py-2 px-4 text-left font-semibold">Stock</th>
            <th className="py-2 px-4 text-left font-semibold">Categoría</th>
            <th className="py-2 px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="py-2 px-4 text-left">{product.id}</td>
              <td className="py-2 px-4 text-left">{product.name}</td>
              <td className="py-2 px-4 text-left">${product.price}</td>
              <td className="py-2 px-4 text-left">{product.stock}</td>
              <td className="py-2 px-4 text-left">{getCategoryName(product.categoryId)}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-green-700 hover:bg-green-800 text-white p-2 rounded transition-colors"
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" />
                  </svg>
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                  onClick={() => handleDelete(product.id)}
                  title="Borrar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts; 