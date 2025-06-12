import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import { reviewsService } from '../services/reviewsService';
import ProductReview from '../components/ProductReview';
import ReviewsList from '../components/ReviewsList';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);
  const { addToCart } = useShoppingCart();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(product ? product.images[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  
  // Referencias para controlar las llamadas API
  const reviewsLoaded = useRef(false);
  const userReviewLoaded = useRef(false);
  // Cargar reseñas del producto
  const loadProductReviews = async () => {
    if (!product) return;
    
    setIsLoadingReviews(true);
    try {
      console.log('Cargando reseñas del producto:', product.id);
      const result = await reviewsService.getProductReviews(product.id);
      
      if (result.success && result.data) {
        setReviews(result.data.reviews || []);
        setAverageRating(result.data.average_rating || 0);
        setTotalReviews(result.data.total_reviews || 0);
      } else {
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setIsLoadingReviews(false);
    }
  };
  // Cargar reseña del usuario actual
  const loadUserReview = async () => {
    if (!product || !user) return;
    
    try {
      console.log('Cargando reseña del usuario para producto:', product.id);
      const result = await reviewsService.getUserReview(product.id);
      
      if (result.success) {
        if (result.notFound || !result.data) {
          // El usuario no tiene reseña - esto es normal, no es un error
          setUserReview(null);
        } else {
          // El usuario tiene una reseña
          setUserReview(result.data);
        }
      } else {
        // Error real del servidor (no es 404)
        setUserReview(null);
      }
    } catch (error) {
      console.error('Unexpected error loading user review:', error);
      setUserReview(null);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);
  useEffect(() => {
    // Reset de referencias cuando cambia el ID del producto
    if (id) {
      reviewsLoaded.current = false;
      userReviewLoaded.current = false;
    }
    
    // Cargar reseñas solo cuando cambie el producto y no se hayan cargado aún
    if (product && !reviewsLoaded.current) {
      reviewsLoaded.current = true; // Marcar como cargado
      loadProductReviews();
    }
  }, [product, id]);
  
  // Efecto separado para cargar la reseña del usuario
  useEffect(() => {
    if (product && user && !userReviewLoaded.current) {
      userReviewLoaded.current = true; // Marcar como cargado
      loadUserReview();
    } else if (!user) {
      setUserReview(null); // Limpiar la reseña si el usuario cierra sesión
    }
  }, [product, user]);

  useEffect(() => {
    // Actualizar imagen seleccionada cuando cambie el producto
    if (product) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

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
  };  // Manejador para enviar una nueva reseña o actualizar una existente
  const handleReviewSubmit = async (reviewData, isEditing) => {
    try {
      // Resetear las banderas de carga para permitir una nueva obtención de datos
      reviewsLoaded.current = false;
      userReviewLoaded.current = false;
      
      // Recargar las reseñas después de crear/actualizar (una sola vez)
      await loadProductReviews();
      await loadUserReview();
      
      // Marcar como cargados después de actualizar
      reviewsLoaded.current = true;
      userReviewLoaded.current = true;
      
      // Limpiar el estado de edición
      setReviewToEdit(null);
    } catch (error) {
      console.error('Error handling review submit:', error);
    }
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

  // Manejador para cancelar edición o creación de reseña
  const handleReviewCancel = () => {
    // Solo limpiar el estado de edición, sin hacer llamadas API
    setReviewToEdit(null);
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
              >                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-80 object-cover object-center transition-transform duration-200 cursor-zoom-in"
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
              {product.images.map((img, idx) => (                <img
                  key={idx}
                  src={img}
                  alt={product.name + ' ' + (idx + 1)}
                  className={`w-16 h-16 object-contain object-center rounded-md border cursor-pointer transition-all duration-200 ${selectedImage === img ? 'ring-2 ring-red-500 scale-110' : ''}`}
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
          </div>          {/* Average Rating y Reviews */}
          <div className="flex-1 md:border-l md:pl-8 border-gray-200">
            <div className="mb-2">
              <span className="font-semibold text-lg text-gray-800">Promedio:</span> 
              <span className="text-yellow-500 font-bold">
                {averageRating} / 5 ({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
            <div>
              <span className="font-semibold text-lg text-gray-800 mb-4 block">Reseñas:</span>              {isLoadingReviews ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-2 text-gray-600">Cargando reseñas...</p>
                </div>              ) : (
                <>
                  <ReviewsList reviews={reviews} onEditReview={handleEditReview} />
                  
                  {/* Sección para agregar o editar reseña - Solo visible cuando las reseñas están cargadas */}
                  <div id="review-form" className="mt-8">
                    {user ? (
                      <>
                        {userReview && !reviewToEdit ? (
                          // Usuario ya tiene reseña y no está editando
                          <div className="bg-green-50 rounded-lg p-6 text-center border border-green-200">
                            <div className="text-green-500 mb-3">
                              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">¡Gracias por tu reseña!</h3>
                            <p className="text-gray-600 mb-4">Ya has dejado una reseña para este producto</p>
                            <button
                              onClick={() => handleEditReview(userReview)}
                              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
                            >
                              Editar mi reseña
                            </button>
                          </div>
                        ) : (                      
                          // Mostrar formulario (nueva reseña o editando)
                          <ProductReview 
                            productId={product.id} 
                            existingReview={reviewToEdit || userReview}
                            onReviewSubmit={handleReviewSubmit}
                            onCancel={handleReviewCancel}
                          />
                        )}
                      </>
                    ) : (
                      // Usuario no autenticado
                      <ProductReview 
                        productId={product.id} 
                        existingReview={null}
                        onReviewSubmit={handleReviewSubmit}
                        onCancel={handleReviewCancel}
                      />
                    )}
                  </div>
                </>
              )}
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