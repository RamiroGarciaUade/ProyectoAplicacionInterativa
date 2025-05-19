import React from "react";
import ProductCardDetail from "../components/ProductCardDetail"; // Assuming ProductCard.jsx is in the same folder

// Ejemplo de datos de producto
const sampleProductData = {
  id: "not-chori-123",
  name: "Dulce de leche con stevia x 450 grs. Doña Magdalena",
  flavor: "dulce",
  weightInGrams: 450,
  brand: {
    name: "NotCo",
    // logoUrl: '/path-to-notco-logo.png'
  },
  price: 6.989,
  originalPrice: 7.765,
  discountPercentage: 10,
  description:
    "Dulce de leche sin azúcar agregado, endulzado con stevia y libre de gluten, apto para celíacos. Producido y exportado por La Retama SRL, Magdalena, Pcia. de Bs. As.Peso neto: 450 gs.",
  ingredients:
    "Agua, aceite vegetal, proteínas vegetales, fibras, gluten de trigo, almidón, sal, espesante: metilcelulosa, saborizantes naturales, colorantes: rojo de remolacha.",
  images: [
    {
      url: "https://via.placeholder.com/600x600.png?text=NotChori+Main",
      alt: "NotChori Main View",
    },
    {
      url: "https://via.placeholder.com/600x600.png?text=NotChori+Pack",
      alt: "NotChori Packaging",
    },
    {
      url: "https://via.placeholder.com/600x600.png?text=NotChori+Detail",
      alt: "NotChori Detail",
    },
  ],
  packageOptions: [
    { label: "4u", subLabel: null, id: "pack-4u" },
    { label: "60g/u", subLabel: "CHORIZO VEGETAL", id: "pack-60g" },
  ],
};

const ProductPage = () => {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-3 mt-2 font-['Montserrat']">
        {" "}
        <nav className="text-sm mt-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="hover:text-emerald-600 text-gray-500">
                Home
              </a>{" "}
              <svg
                className="fill-current w-3 h-3 mx-3 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            {/* Example: If you have a category page before product
            <li className="flex items-center">
              <a href="/almacen" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600">Almacén</a>
              <svg className="fill-current w-3 h-3 mx-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            */}
            <li className="flex items-center font-['Montserrat']">
              <span>{sampleProductData.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <main>
        <ProductCardDetail product={sampleProductData} />
      </main>
    </div>
  );
};

export default ProductPage;
