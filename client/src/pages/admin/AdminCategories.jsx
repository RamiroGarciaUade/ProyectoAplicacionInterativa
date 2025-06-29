import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "../../redux/userSlice";
import { 
  selectAdminCategories, 
  selectAdminLoading, 
  selectAdminError,
  fetchAllCategories,
  deleteCategory 
} from "../../redux/adminSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const AdminCategories = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const categories = useSelector(selectAdminCategories);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllCategories());
    }
  }, [isAuthenticated, dispatch]);

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
      } catch (err) {
        alert("Error al eliminar categoría");
      }
    }
  };

  if (loading.categories) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error.categories) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error.categories}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800">
          Gestión de Categorías
        </h1>
        <Link
          to="/admin/categories/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Agregar Categoría
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {category.description || "Sin descripción"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.productCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/categories/${category.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories; 