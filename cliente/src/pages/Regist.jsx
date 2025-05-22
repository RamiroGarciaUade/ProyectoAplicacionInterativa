import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Regist = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({}); // un objeto que vincula a un atributo ej email con un mesaje

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password); // Al menos una mayúscula
    const hasThreeNumbers = /\d.*\d.*\d/.test(password); // Al menos tres números
    const hasSpecialChar = /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/~]/.test(password); // Al menos un carácter especial
    const isLongEnough = password.length >= 8; // Al menos 8 caracteres

    return hasUpperCase && hasThreeNumbers && hasSpecialChar && isLongEnough;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "La contraseña debe contener una mayúscula, tres números y un carácter especial.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "La confirmación de contraseña es requerida.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Enviar los datos al backend
      console.log("Formulario válido:", formData);
    }
  };

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r outline-1 outline-green-400 bg-[url('..\public\fondo_login_regist.jpg')] bg-contain bg-center">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-96 outline-1 outline-green-400">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Registro
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full h-12 border border-green-300 px-3 rounded-lg"
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full h-12 border border-green-300 px-3 rounded-lg"
            type="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full h-12 border border-green-300 px-3 rounded-lg"
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full h-12 border border-green-300 px-3 rounded-lg"
            type="password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}

          <input
            name="confirmPassword" // ✅ ahora el name es correcto
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme contraseña"
            className="w-full h-12 border border-green-300 px-3 rounded-lg"
            type="password"
          />
          {errors.confirmPassword && ( // ✅ mostramos el error correcto
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Registrarse
          </button>
          <button
            onClick={handleLoginClick}
            className="w-full h-10 mt-2 border border-green-500 text-green-600 hover:bg-green-300 hover:text-white font-semibold rounded"
            type="button"
          >
            ¿Ya tiene cuenta?
          </button>
        </form>
      </div>
    </div>
  );
};

export default Regist;
