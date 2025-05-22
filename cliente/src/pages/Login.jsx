import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate("/regist");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, introduce un email válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Login exitoso:", formData);
      // Aquí iría el llamado al backend
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('..\public\fondo_login_regist.jpg')] bg-contain bg-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96 outline-1 outline-green-400">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Login
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
          >
            Entrar
          </button>

          <button
            onClick={handleRegisterClick}
            className="w-full h-10 mt-2 border border-green-500 text-green-600 hover:bg-green-300 hover:text-white font-semibold rounded"
            type="button"
          >
            ¿No tienes cuenta?
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
