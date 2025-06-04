import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditUser = () => {
  const { id } = useParams();
  const { token, user: currentUser, updateUser } = useAuth();
  const isNew = id === "new";
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER"
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`http://localhost:8080/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Error al cargar usuario");
          const data = await res.json();
          setUser(data);
          setOriginalUser(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, token, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRoleChange = (e) => {
    setUser({ ...user, role: e.target.value });
  };

  const hasChanges = () => {
    if (isNew) {
      return Boolean(
        user.firstName.trim() &&
        user.lastName.trim() &&
        user.email.trim() &&
        user.address && user.address.trim() &&
        password.trim()
      );
    }
    if (!originalUser) return false;
    return (
      user.firstName !== originalUser.firstName ||
      user.lastName !== originalUser.lastName ||
      user.email !== originalUser.email ||
      user.role !== originalUser.role ||
      user.address !== originalUser.address
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      let updatedUserData = user;
      if (isNew) {
        const data = new FormData();
        data.append("firstName", user.firstName);
        data.append("lastName", user.lastName);
        data.append("email", user.email);
        data.append("address", user.address);
        data.append("password", password);
        data.append("role", user.role);

        res = await fetch(`http://localhost:8080/users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
      } else {
        res = await fetch(`http://localhost:8080/users/role/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        });
      }
      if (!res.ok) throw new Error(isNew ? "Error al crear usuario" : "Error al actualizar usuario");
      if (!isNew && currentUser && String(currentUser.id) === String(id)) {
        const updated = await res.json().catch(() => user);
        updateUser(updated);
      }
      navigate("/admin/users");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Cargando usuario...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">{isNew ? "Crear Usuario" : "Editar Usuario"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {!isNew && (
          <div>
            <label className="block text-gray-700">ID</label>
            <input value={user.id} disabled className="w-full bg-gray-100 text-gray-500 rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input name="firstName" value={user.firstName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Apellido</label>
          <input name="lastName" value={user.lastName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input name="email" value={user.email || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700">Dirección</label>
          <input name="address" value={user.address || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {!isNew && (
          <div>
            <label className="block text-gray-700">Rol</label>
            <select name="role" value={user.role} onChange={handleRoleChange} className="w-full border rounded px-3 py-2">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        )}
        {isNew && (
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}
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
            onClick={() => navigate("/admin/users")}
            className="px-6 py-2 rounded font-semibold bg-green-200 text-green-900 hover:bg-green-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser; 