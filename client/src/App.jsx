import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext"; // Importa useCart
import { ProtectedRoute } from "./components/ProtectedRoute";
import AddedToCartNotification from "./components/AddedToCartNotification"; // Importa el componente

// Un componente wrapper para acceder al contexto del carrito
const AppContent = () => {
  const { notification, closeNotification, cartItemsCount } = useCart(); // Obtén el estado de la notificación
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart onLoginClick={() => setShowLogin(true)} />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute onLoginClick={() => setShowLogin(true)}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<Success />} />
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
      <Footer />
      {notification.show && (
        <AddedToCartNotification
          productName={notification.productName}
          productImage={notification.productImage}
          productPrice={notification.productPrice}
          quantityAdded={notification.quantityAdded}
          cartItemCount={cartItemsCount} // Pasar el conteo total actual
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* CartProvider envuelve AppContent */}
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;