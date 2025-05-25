import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Importa el Footer
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <main className="flex-grow"> {/* Añade flex-grow para que el footer se quede abajo */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            {/* Protege la ruta del carrito */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onSwitch={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <Register
            onClose={() => setShowRegister(false)}
            onSwitch={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
        <Footer /> {/* Renderiza el Footer aquí */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;