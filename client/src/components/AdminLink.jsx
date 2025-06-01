import React from "react";
import { Link } from "react-router-dom";

const AdminLink = () => (
  <Link
    to="/admin/sales"
    className="text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200"
  >
    Ventas
  </Link>
);

export default AdminLink;
