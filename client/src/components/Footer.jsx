import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription for:", email);
    setEmail("");
  };

  return (
    <footer className="bg-green-900 text-white py-10 font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Institucional</h3>
            <ul>
              <li className="mb-2">
                <Link to="/about" className="hover:underline">
                  Sobre Dietética Yuyo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Condiciones de Envío
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Términos y Condiciones
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Ventas Corporativas
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Trabaja con Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Cómo comprar
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Medios de Pago
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Política de cambios
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Ventas Mayoristas y Franquicias
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline">
                  Locales Asociados
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
            <p className="mb-2">📞 +54 9 11 2796-9705</p>
            <p className="mb-2">📧 info@dieteticayuyo.com.ar</p>
            
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              Recibí nuestras novedades
            </h3>
            <p className="text-sm mb-4">
              Suscribite y recibí descuentos exclusivos.
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Tu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 rounded-l-md w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 p-2 rounded-r-md transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-6 text-center text-sm text-green-200">
          <p>
            Copyright Dietética Yuyo - {new Date().getFullYear()}. Todos los
            derechos reservados.{" "}
            <Link to="#" className="hover:underline">
              Defensa de las y los consumidores
            </Link>
            . Para reclamos ingrese{" "}
            <Link to="#" className="hover:underline">
              aquí
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
