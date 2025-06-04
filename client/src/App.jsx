import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext"; // Importa useCart
import { ProtectedRoute } from "./components/ProtectedRoute";
import AddedToCartNotification from "./components/AddedToCartNotification"; // Importa el componente
import AdminRoute from "./routes/AdminRoute";
import AdminUsers from "./pages/admin/AdminUsers";
import EditUser from "./pages/admin/EditUser";

// Un componente wrapper para acceder al contexto del carrito
const AppContent = () => {
  const { notification, closeNotification, cartItemsCount } = useCart(); // Obtén el estado de la notificación
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname !== "/logout" && (
        <Navbar onLoginClick={() => setShowLogin(true)} />
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
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
          <Route path="/logout" element={<Logout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/users/:id" element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          } />
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
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {" "}
        {/* CartProvider envuelve AppContent */}
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
