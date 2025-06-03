import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
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
import Store from "./pages/Store";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <NavBar onLoginClick={() => setShowLogin(true)} />
        <main className="flex-grow">
          {" "}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/products/:productId"
              element={<ProductDetail />}
            ></Route>
            <Route path="/store" element={<Store />} />
            <Route
              path="/cart"
              element={<Cart onLoginClick={() => setShowLogin(true)} />}
            />
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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
