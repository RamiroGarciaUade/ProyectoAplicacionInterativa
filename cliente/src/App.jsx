import Navbar from "./components/NavBar";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Login from "./pages/Login";
import Regist from "./pages/Regist";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  // No redenliza el Nav
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/regist"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/regist" element={<Regist />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
