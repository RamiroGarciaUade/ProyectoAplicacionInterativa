import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
            <Link
              to="/ProductPage"
              className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              ProductDetail
            </Link>
            <Link
              to="/cart"
              className="text-green-600 hover:text-green-700 transition-colors duration-200"
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
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                console.log(!isMenuOpen);
              }}
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
              to="/ProductDetail"
              className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              ProductDetail
            </Link>
            <Link
              to="/cart"
              className="w-full text-left px-3 py-2 text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
            >
              Cart
            </Link>
          </div>
        </div>
      )}

      {/* Cart Side Panel */}
      {isCartOpen && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-green-600">
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* Aca van los productos */}
              <p className="text-gray-500">Tu carrito esta vacio</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
