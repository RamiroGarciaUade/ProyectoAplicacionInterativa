import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import AddedToCartNotification from "../components/AddedToCartNotification"; // Asegúrate que la ruta sea correcta
// import ProductCarousel from "../components/ProductCarousel"; // Descomenta si implementas productos relacionados

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState(null);
  // const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:8080/products/${productId}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          if (data.imageUrls && data.imageUrls.length > 0) {
            setSelectedImage(data.imageUrls[0]);
          }
          // Ejemplo para cargar productos relacionados (ajusta según tu API)
          // if (data.categoryId) {
          //   fetch(`http://localhost:8080/products/category/${data.categoryId}?exclude=${productId}&limit=4`) // Suponiendo que tu API soporta esto
          //     .then(res => res.json())
          //     .then(setRelatedProducts)
          //     .catch(err => console.error("Error fetching related products:", err));
          // }
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    }
  }, [productId]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = discountPercentage ? parseFloat(discountPercentage) : 0;
    if (numericDiscount > 0) {
      const discountAmount = (numericPrice * numericDiscount) / 100;
      return numericPrice - discountAmount;
    }
    return numericPrice;
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0 || quantity > product.stock) {
        // Opcional: mostrar un error si se intenta agregar más del stock
        console.warn("No se puede agregar al carrito: sin stock o cantidad excede stock.");
        return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setNotificationProduct({
      name: product.name,
      image: selectedImage || product.imageUrls?.[0],
      price: calculateDiscountedPrice(product.price, product.discountPercentage),
      quantity: quantity, // Para mostrar la cantidad agregada en la notificación si se desea
    });
    setShowNotification(true);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Cargando producto...</p>
      </div>
    );
  }

  const originalPrice = parseFloat(product.price);
  const discountPercentage = product.discountPercentage ? parseFloat(product.discountPercentage) : 0;
  const effectivePrice = calculateDiscountedPrice(originalPrice, discountPercentage);

  const currentCartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-3 mt-2 font-['Montserrat']">
          <nav className="text-sm mt-4 mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center text-gray-600">
              <li className="flex items-center">
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Inicio
                </Link>
                <svg className="fill-current w-3 h-3 mx-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li className="flex items-center">
                <Link to="/shop" className="hover:text-green-600 transition-colors">
                  Productos
                </Link>
                <svg className="fill-current w-3 h-3 mx-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li className="flex items-center text-gray-800 font-medium">
                <span>{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>

        <main className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/2 flex flex-col">
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 h-80 sm:h-96 md:h-[450px] flex items-center justify-center bg-gray-100 relative">
                <img
                  src={selectedImage || product.imageUrls?.[0] || "https://via.placeholder.com/400x400?text=Sin+Imagen"}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-opacity duration-300"
                  key={selectedImage} // Para forzar re-render en cambio de imagen si es necesario
                />
                {discountPercentage > 0 && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-md shadow-lg">
                    {discountPercentage.toFixed(0)}% OFF
                  </span>
                )}
              </div>
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-1">
                  {product.imageUrls.map((url, index) => (
                    <button 
                      key={index} 
                      onClick={() => setSelectedImage(url)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-md overflow-hidden flex-shrink-0 transition-all duration-150 hover:opacity-80
                                  ${selectedImage === url ? 'border-green-500 border-2 ring-2 ring-green-300' : 'border-gray-300'}`}
                    >
                      <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-1/2 flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{product.name}</h1>
              {/* Aquí puedes añadir info como marca o categoría si está disponible en 'product' */}
              {/* <p className="text-sm text-gray-500 mb-3">Categoría: {product.categoryName || 'General'}</p> */}
              
              <div className="mb-4 mt-2">
                {discountPercentage > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-green-600">
                      {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(effectivePrice)}
                    </p>
                    <p className="text-xl text-gray-400 line-through">
                      {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(originalPrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(originalPrice)}
                  </p>
                )}
              </div>

              {/* Ejemplo de promociones (ajusta según los datos de tu producto) */}
              {/* {product.promotionalText && (
                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-3 rounded-md mb-4 text-sm">
                  <p><strong>{product.promotionalText}</strong></p>
                </div>
              )}*/}

              <div className="mb-5">
                <h3 className="text-md font-semibold text-gray-700 mb-1">Descripción:</h3>
                <p className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none">
                  {product.description || "No hay descripción disponible para este producto."}
                </p>
              </div>
              
              <div className="mb-5">
                <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `Disponibles: ${product.stock} unidades` : 'Producto sin stock'}
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                  <button
                    className="px-3 py-2 text-lg text-gray-700 hover:bg-gray-100 rounded-l-md transition disabled:opacity-50"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || product.stock === 0}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-md font-medium text-gray-800 w-12 text-center tabular-nums">{quantity}</span>
                  <button
                    className="px-3 py-2 text-lg text-gray-700 hover:bg-gray-100 rounded-r-md transition disabled:opacity-50"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || quantity > product.stock}
                  className={`flex-grow bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-md transition-all duration-150 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                >
                  {product.stock === 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-5 mt-auto text-sm text-gray-600">
                {/* Aquí puedes añadir más información como categorías, tags, etc. */}
                <p><span className="font-medium text-gray-700">Categoría:</span> {product.category?.name || 'No especificada'}</p>
                {/* <p><span className="font-medium text-gray-700">SKU:</span> {product.sku || 'N/D'}</p> */}
              </div>
            </div>
          </div>

          {/* Sección "También te puede interesar" - Descomenta y adapta si la implementas */}
          {/* {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">También te puede interesar</h2>
              <ProductCarousel products={relatedProducts} />
            </div>
          )} */}
        </main>
      </div>
      {showNotification && notificationProduct && (
        <AddedToCartNotification
          productName={notificationProduct.name}
          productImage={notificationProduct.image}
          productPrice={notificationProduct.price}
          cartItemCount={currentCartItemCount + notificationProduct.quantity}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default ProductDetail;