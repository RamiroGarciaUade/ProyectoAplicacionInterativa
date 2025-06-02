import { Link } from "react-router-dom";

const UserCart = ({ count, isMobile = false }) => (
  <Link
    to="/cart"
    className={`${
      isMobile ? "block px-3 py-2" : ""
    } text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200 relative`}
  >
    Cart
    {count > 0 && (
      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 inline-flex items-center justify-center">
        {count}
      </span>
    )}
  </Link>
);

export default UserCart;
