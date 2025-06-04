import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditCategory = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const isNew = id === "new";
  const [category, setCategory] = useState({
    name: "",
    description: ""
  });
  const [originalCategory, setOriginalCategory] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`http://localhost:8080/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Error al cargar categoría");
          const data = await res.json();
          setCategory(data);
          setOriginalCategory(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, token, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const hasChanges = () => {
    if (isNew) {
      return category.name.trim() && category.description.trim();
    }
    if (!originalCategory) return false;
    return (
      category.name !== originalCategory.name ||
      category.description !== originalCategory.description
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isNew) {
        res = await fetch(`http://localhost:8080/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        });
      } else {
        res = await fetch(`http://localhost:8080/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        });
      }
      if (!res.ok) throw new Error(isNew ? "Error al crear categoría" : "Error al actualizar categoría");
      navigate("/admin/categories");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Cargando categoría...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!category) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">{isNew ? "Crear Categoría" : "Editar Categoría"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {!isNew && (
          <div>
            <label className="block text-gray-700">ID</label>
            <input value={category.id} disabled className="w-full bg-gray-100 text-gray-500 rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input name="name" value={category.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={category.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded transition-colors font-semibold ${hasChanges() ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!hasChanges()}
          >
            {isNew ? "Crear" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-2 rounded font-semibold bg-green-200 text-green-900 hover:bg-green-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory; 