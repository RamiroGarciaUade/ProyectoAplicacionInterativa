import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-10 font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Institucional */}
          <div>
            <h3 className="text-lg font-bold mb-4">Institucional</h3>
            <ul>
              <li className="mb-2"><Link to="/about" className="hover:underline">Sobre Dietética Yuyo</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Condiciones de Envío</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Términos y Condiciones</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Ventas Corporativas</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Trabaja con Nosotros</Link></li>
            </ul>
          </div>

          {/* Columna 2: Ayuda */}
          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul>
              <li className="mb-2"><Link to="#" className="hover:underline">Cómo comprar</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Medios de Pago</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Política de cambios</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Ventas Mayoristas y Franquicias</Link></li>
              <li className="mb-2"><Link to="#" className="hover:underline">Locales Asociados</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
            <p className="mb-2">📞 +54 9 11 2796-9705</p>
            <p className="mb-2">📧 info@dieteticayuyo.com.ar</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 4: Newsletter y Medios de Pago */}
          <div>
            <h3 className="text-lg font-bold mb-4">Recibí nuestras novedades</h3>
            <p className="text-sm mb-4">Suscribite y recibí descuentos exclusivos.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Tu Email"
                className="p-2 rounded-l-md w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 p-2 rounded-r-md transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <h3 className="text-lg font-bold mt-8 mb-4">Medios de pago</h3>
            {/* Aquí puedes añadir las imágenes de los logos de medios de pago */}
            <div className="flex flex-wrap gap-2">
              <img src="https://via.placeholder.com/60x30?text=Visa" alt="Visa" className="h-8" />
              <img src="https://via.placeholder.com/60x30?text=Mastercard" alt="Mastercard" className="h-8" />
              <img src="https://via.placeholder.com/60x30?text=Amex" alt="American Express" className="h-8" />
              <img src="https://via.placeholder.com/60x30?text=MP" alt="Mercado Pago" className="h-8" />
              {/* Añade más logos según necesites */}
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-6 text-center text-sm text-green-200">
          <p>Copyright Dietética Yuyo - {new Date().getFullYear()}. Todos los derechos reservados. <Link to="#" className="hover:underline">Defensa de las y los consumidores</Link>. Para reclamos ingrese <Link to="#" className="hover:underline">aquí</Link>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;