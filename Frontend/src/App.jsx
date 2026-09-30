import { Routes, Route } from "react-router-dom";
import { apiRequest } from "./api/client";
import Home from "./pages/Home";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Navbar from "./components/Navbar/Navbar";
import ShopAll from "./pages/ShopAll";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import ShopPage from "./components/ShopPage/ShopPage";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Checkout from "./pages/Checkout/Checkout";
import OrderTracking from "./pages/OrderTracking/OrderTracking";

function App() {
  function App() {
    useEffect(() => {
      apiRequest("/products")
        .then((data) => console.log("API reachable:", data))
        .catch((err) => console.error("API test failed:", err.message));
    }, []);
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ShopAll" element={<ShopAll />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/OrderTracking" element={<OrderTracking />} />
      </Routes>
    </>
  );
}

export default App;