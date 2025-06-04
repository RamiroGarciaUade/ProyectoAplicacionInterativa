import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditProduct = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const isNew = id === "new";
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    discountPercentage: 0
  });
  const [originalProduct, setOriginalProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

  useEffect(() => {
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
    fetchCategories();
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:8080/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Error al cargar producto");
          const data = await res.json();
          setProduct(data);
          setOriginalProduct(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, token, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setProduct({ ...product, categoryId: e.target.value });
  };

  const handleDiscountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    // Solo múltiplos de 5
    value = Math.round(value / 5) * 5;
    setProduct({ ...product, discountPercentage: value });
  };

  const handleDiscountStep = (step) => {
    let value = product.discountPercentage + step;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setProduct({ ...product, discountPercentage: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageFileName(file ? file.name : "");
  };

  const hasChanges = () => {
    if (isNew) {
      return (
        product.name.trim() &&
        product.description.trim() &&
        product.price &&
        product.stock &&
        product.categoryId !== ""
      );
    }
    if (!originalProduct) return false;
    return (
      product.name !== originalProduct.name ||
      product.description !== originalProduct.description ||
      String(product.price) !== String(originalProduct.price) ||
      String(product.stock) !== String(originalProduct.stock) ||
      String(product.categoryId) !== String(originalProduct.categoryId) ||
      product.discountPercentage !== originalProduct.discountPercentage ||
      imageFile
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("categoryId", product.categoryId);
      formData.append("discountPercentage", product.discountPercentage);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (isNew) {
        res = await fetch(`http://localhost:8080/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(`http://localhost:8080/products/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }
      if (!res.ok) throw new Error(isNew ? "Error al crear producto" : "Error al actualizar producto");
      navigate("/admin/products");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">{isNew ? "Crear Producto" : "Editar Producto"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {!isNew && (
          <div>
            <label className="block text-gray-700">ID</label>
            <input value={product.id} disabled className="w-full bg-gray-100 text-gray-500 rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input name="name" value={product.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={product.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-gray-700">Precio</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" step="0.01" />
        </div>
        <div>
          <label className="block text-gray-700">Stock</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" min="0" />
        </div>
        <div>
          <label className="block text-gray-700">Categoría</label>
          <select name="categoryId" value={product.categoryId} onChange={handleCategoryChange} className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Descuento (%)</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleDiscountStep(-5)} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold" tabIndex={-1}>-</button>
            <input
              type="number"
              name="discountPercentage"
              value={product.discountPercentage}
              readOnly
              className="w-16 border rounded px-2 py-1 text-center bg-gray-100"
            />
            <button type="button" onClick={() => handleDiscountStep(5)} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold" tabIndex={-1}>+</button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Imagen</label>
          <div className="flex items-center gap-2">
            <span className="flex-1 px-3 py-2 border rounded bg-gray-50 text-gray-700">
              {imageFileName || "Ningún archivo seleccionado"}
            </span>
            <label className="bg-green-200 text-green-900 px-4 py-2 rounded cursor-pointer hover:bg-green-300 font-medium">
              Seleccionar archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
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
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 rounded font-semibold bg-green-200 text-green-900 hover:bg-green-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 