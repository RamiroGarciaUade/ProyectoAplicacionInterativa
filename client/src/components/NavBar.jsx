import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // Inicializa useNavigate

  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar página)
    if (searchTerm.trim()) { // Si el término de búsqueda no está vacío
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`); // Redirige a /shop con el término de búsqueda
      setSearchTerm(""); // Limpia el campo de búsqueda
      setIsMenuOpen(false); // Cierra el menú móvil si está abierto
    }
  };

  return (
    <nav className="bg-white shadow-md font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-['Merriweather'] font-bold text-green-700">
                Dietetica Yuyo
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              About
            </Link>
            {/* Buscador en el Navbar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-700 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors duration-200"
                aria-label="Buscar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <Link
              to="/cart"
              className="text-green-600 hover:text-green-700 transition-colors duration-200 relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
                >
                  Login
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {/* Buscador para menú móvil */}
            <form onSubmit={handleSearchSubmit} className="flex items-center mr-4">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-l-md p-2 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-700 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors duration-200"
                aria-label="Buscar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            {/* Botón de menú hamburguesa */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-green-600 hover:text-green-700 focus:outline-none transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200 relative"
            >
              Cart
              {cartItemsCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 inline-flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;