import React from "react";
import ProductCard from "../components/ProductCard";

const products = [
  {
    name: "Producto 1",
    price: 12.99,
    weightInGrams: 500,
    description: "Descripción breve...",
  },
  {
    name: "Producto 2",
    price: 8.5,
    weightInGrams: 300,
    description: "Otra descripción...",
  },
  {
    name: "Producto 3",
    price: 15.75,
    weightInGrams: 450,
    description: "Producto fresco y de alta calidad.",
  },
  {
    name: "Producto 4",
    price: 9.99,
    weightInGrams: 350,
    description: "Ideal para snacks saludables.",
  },
];

const Shop = () => {
  return (
    <>
      <div className="flex items-center justify-center text-green-800 font-bold pt-7">
        <h1>Destacados</h1>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6 items-start">
          {products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Shop;
