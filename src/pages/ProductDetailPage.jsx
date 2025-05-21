import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductReview from '../components/ProductReview';
import ReviewsList from '../components/ReviewsList';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);
  const { addToCart } = useShoppingCart();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(product ? product.images[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(product ? product.reviews : []);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [averageRating, setAverageRating] = useState(product ? product.averageRating : 0);

  // Encuentra la reseña del usuario actual si existe
  const userReview = user && reviews.find(review => review.userId === user.id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Inicializar reviews y rating del producto
    if (product) {
      setReviews(product.reviews);
      setAverageRating(product.averageRating);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Product Not Found</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">No product found with id {id}.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, Number(e.target.value)));
    setQuantity(value);
  };

  // Manejador para enviar una nueva reseña o actualizar una existente
  const handleReviewSubmit = (reviewData, isEditing) => {
    let updatedReviews;
    
    if (isEditing) {
      // Actualizar una reseña existente
      updatedReviews = reviews.map(review => 
        review.id === reviewData.id ? reviewData : review
      );
    } else {
      // Agregar una nueva reseña
      updatedReviews = [...reviews, reviewData];
    }
    
    setReviews(updatedReviews);
    
    // Calcular nuevo promedio
    const newAverageRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0) / updatedReviews.length;
    setAverageRating(newAverageRating.toFixed(1));
    
    // Limpiar el estado de edición
    setReviewToEdit(null);
  };

  // Manejador para editar una reseña
  const handleEditReview = (review) => {
    setReviewToEdit(review);
    // Desplazar la vista hacia el formulario de reseña
    setTimeout(() => {
      const reviewForm = document.getElementById('review-form');
      if (reviewForm) {
        reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {/* Breadcrumbs */}
      <nav className="mb-10 text-base text-gray-500 flex items-center justify-center gap-2 md:text-lg md:gap-3">
        <Link to="/" className="hover:underline text-red-600 font-semibold">Inicio</Link>
        <span className="mx-1">/</span>
        <Link to="/products" className="hover:underline text-red-600 font-semibold">Productos</Link>
        {product.categoryId && (
          <>
            <span className="mx-1">/</span>
            <span className="text-gray-700 font-bold">{product.categoryId}</span>
          </>
        )}
      </nav>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Galería de imágenes principal */}
          <div className="md:w-1/2">
            <div className="relative group">
              <div
                className="w-full h-80 rounded-lg mb-4 border-4 border-red-100 shadow-md overflow-hidden bg-white flex items-center justify-center"
                style={{ position: 'relative' }}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-80 object-cover transition-transform duration-200 cursor-zoom-in"
                  style={{ objectPosition: 'center' }}
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.transform = `scale(1.5)`;
                    e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.transformOrigin = 'center';
                  }}
                />
                {/* Icono de lupa */}
                <span className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow text-gray-700 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-4.65a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </span>
              </div>
              {/* Opcional: video corto si existe product.video */}
              {product.video && (
                <video controls className="w-full rounded-lg mb-2 mt-2">
                  <source src={product.video} type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
              )}
            </div>
            {/* Miniaturas y galería interactiva */}
            <div className="flex gap-2 justify-center mt-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={product.name + ' ' + (idx + 1)}
                  className={`w-16 h-16 object-cover rounded-md border cursor-pointer transition-all duration-200 ${selectedImage === img ? 'ring-2 ring-red-500 scale-110' : ''}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
            {/* Ejemplo de imagen en contexto/uso */}
            {product.contextImage && (
              <div className="mt-4">
                <span className="block text-xs text-gray-500 mb-1">Producto en uso:</span>
                <img src={product.contextImage} alt="Producto en uso" className="w-full h-40 object-cover rounded-md" />
              </div>
            )}
          </div>
          <div className="md:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {product.brand ? `${product.brand} ` : ''}{product.name}{product.model ? ` - ${product.model}` : ''}
            </h1>
            <p className="text-gray-500 text-lg mb-6">
              {product.shortDescription || product.description}
            </p>
            <div className="flex items-center gap-4 mb-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">S/ {product.salePrice.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through">S/ {product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-800">S/ {product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Stock:</span> {product.stock > 0 ? product.stock : 'Out of stock'}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Cantidad:</span>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 border rounded px-2 py-1 text-center"
                disabled={product.stock === 0}
              />
            </div>
            <div className="mb-2">
              <span className="font-semibold text-lg text-red-700">Total:</span>{' '}
              <span className="text-2xl font-bold text-red-600">
                {product.salePrice
                  ? `S/ ${(product.salePrice * quantity).toFixed(2)}`
                  : `S/ ${(product.price * quantity).toFixed(2)}`}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
        {/* Sección horizontal de especificaciones, rating y reviews */}
        <div className="mt-8 w-full bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row md:items-start md:gap-8 shadow-inner">
          {/* Specifications */}
          <div className="flex-1 mb-6 md:mb-0">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">Especificaciones</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-gray-700">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}><span className="font-medium">{key}:</span> {value}</li>
              ))}
            </ul>
          </div>
          {/* Average Rating y Reviews */}
          <div className="flex-1 md:border-l md:pl-8 border-gray-200">
            <div className="mb-2">
              <span className="font-semibold text-lg text-gray-800">Promedio:</span> <span className="text-yellow-500 font-bold">{averageRating} / 5</span>
            </div>
            <div>
              <span className="font-semibold text-lg text-gray-800 mb-4 block">Reseñas:</span>
              <ReviewsList reviews={reviews} onEditReview={handleEditReview} />
              
              {/* Sección para agregar o editar reseña */}
              <div id="review-form" className="mt-8">
                {!userReview || reviewToEdit ? (
                  <ProductReview 
                    productId={product.id} 
                    existingReview={reviewToEdit || userReview}
                    onReviewSubmit={handleReviewSubmit}
                  />
                ) : (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-700">Ya has dejado una reseña para este producto.</p>
                    <button
                      onClick={() => handleEditReview(userReview)}
                      className="mt-2 text-red-600 hover:text-red-800 font-medium"
                    >
                      Editar mi reseña
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Productos relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Productos relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockProducts
            .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
            .slice(0, 3)
            .map(related => (
              <div key={related.id} className="">
                <Link to={`/products/${related.id}`} className="block hover:shadow-lg rounded-lg transition-shadow duration-200">
                  <img src={related.images[0]} alt={related.name} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="bg-white p-4 rounded-b-lg">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">{related.name}</h3>
                    <p className="text-red-600 font-bold text-md mb-1">
                      {related.salePrice ? (
                        <>
                          S/ {related.salePrice.toFixed(2)} <span className="text-gray-400 line-through text-sm">S/ {related.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <>S/ {related.price.toFixed(2)}</>
                      )}
                    </p>
                    <span className="text-sm text-gray-500">{related.stock > 0 ? 'En stock' : 'Agotado'}</span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;