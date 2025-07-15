import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import { reviewsService } from '../services/reviewsService';
import { productsService } from '../services/productsService';
import stockService from '../services/stockService';
import StockAlert from '../components/StockAlert';
import config from '../config/config';
import ProductReview from '../components/ProductReview';
import ReviewsList from '../components/ReviewsList';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useShoppingCart();
  const { user } = useAuth();
  
  // Estados para el producto
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [selectedImage, setSelectedImage] = useState('');
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

  // Función para transformar datos del backend al formato frontend
  const transformProductData = (backendProduct) => {
    // Generar URL de imagen con múltiples fallbacks
    const getImageUrl = (product) => {
      // Primera opción: url_imagen_completa (accessor del backend)
      if (product.url_imagen_completa) {
        return product.url_imagen_completa;
      }
      
      // Segunda opción: construir URL desde url_imagen
      if (product.url_imagen) {
        return config.getApiUrl(`/storage/${product.url_imagen}`);
      }
      
      // Tercera opción: imagen por defecto
      return '/images/placeholder-strawberry.jpg';
    };

    // Crear especificaciones basadas en los datos del producto
    const specifications = {};
    
    // Solo agregar especificaciones si tenemos los datos del backend
    if (backendProduct.peso) {
      specifications['Peso'] = backendProduct.peso;
    }
    
    if (backendProduct.estado) {
      // Usar información del inventario si está disponible, sino usar el estado del producto
      const isAvailable = backendProduct.en_stock !== undefined ? backendProduct.en_stock : backendProduct.estado === 'activo';
      const stockAmount = backendProduct.cantidad_disponible || 0;
      specifications['Estado'] = isAvailable && stockAmount > 0 ? `Disponible (${stockAmount} unidades)` : 'Agotado';
    }
    
    if (backendProduct.categoria?.nombre) {
      specifications['Categoría'] = backendProduct.categoria.nombre;
    }
    
    // Agregar información de reviews si está disponible
    if (backendProduct.comentarios_count !== undefined) {
      specifications['Reseñas'] = `${backendProduct.comentarios_count} ${backendProduct.comentarios_count === 1 ? 'reseña' : 'reseñas'}`;
    }
    
    // Si no hay especificaciones, agregar al menos una por defecto
    if (Object.keys(specifications).length === 0) {
      specifications['Información'] = 'Especificaciones no disponibles';
    }

    return {
      id: backendProduct.id_producto.toString(),
      name: backendProduct.nombre,
      description: backendProduct.descripcion,
      price: parseFloat(backendProduct.precio),
      salePrice: null, // No hay precios de oferta en el backend actual
      images: [
        getImageUrl(backendProduct),
        getImageUrl(backendProduct), // Duplicamos la imagen principal
        getImageUrl(backendProduct)  // por compatibilidad con el frontend
      ],
      categoryId: backendProduct.categorias_id_categoria?.toString() || '1',
      categoryName: backendProduct.categoria?.nombre || 'Sin categoría',
      stock: backendProduct.cantidad_disponible || 0, // Usar la cantidad real disponible del inventario
      featured: false, // Valor por defecto
      inStock: backendProduct.en_stock || false, // Usar el estado real del inventario
      
      // Datos de stock del backend
      en_stock: backendProduct.en_stock,
      cantidad_disponible: backendProduct.cantidad_disponible,
      inventario_info: backendProduct.inventario_info,
      inventarios: backendProduct.inventarios,
      
      weight: backendProduct.peso,
      specifications: specifications,
      averageRating: backendProduct.comentarios_avg_calificacion || 0,
      totalReviews: backendProduct.comentarios_count || 0,
      reviews: [] // Se cargan por separado
    };
  };

  // Cargar producto desde el backend
  const loadProduct = async () => {
    if (!id) {

      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      

      const response = await productsService.getProduct(id);

      
      if (response?.success && response?.data) {
        const productData = response.data;

        
        const transformedProduct = transformProductData(productData);

        
        setProduct(transformedProduct);
        setSelectedImage(transformedProduct.images[0]);
        
        // Cargar productos relacionados
        if (transformedProduct.categoryId) {
          loadRelatedProducts(transformedProduct.categoryId);
        }
      } else {

        setError('Producto no encontrado');
      }
    } catch (error) {
      console.error('💥 Error loading product:', error);
      console.error('💥 Error response:', error.response?.data);
      setError(`Error al cargar el producto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos relacionados
  const loadRelatedProducts = async (categoryId) => {
    try {
      const response = await productsService.getProducts({
        categoria: categoryId,
        por_pagina: 4 // Obtener 4 productos para mostrar 3 (excluyendo el actual)
      });
      
      if (response?.success && response?.data?.data) {
        const relatedProductsData = response.data.data
          .filter(p => p.id_producto.toString() !== id) // Excluir el producto actual
          .slice(0, 3) // Tomar solo 3 productos
          .map(p => transformProductData(p));
        
        setRelatedProducts(relatedProductsData);
      }
    } catch (error) {
      console.error('Error loading related products:', error);
      setRelatedProducts([]);
    }
  };
  // Cargar reseñas del producto
  const loadProductReviews = async () => {
    if (!product) return;
    
    setIsLoadingReviews(true);
    try {

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
    // Cargar producto cuando cambie el ID
    loadProduct();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando producto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Producto no encontrado</h1>
            <p className="text-gray-600 mb-6">{error || `No se encontró el producto con ID ${id}.`}</p>
            <div className="space-x-4">
              <Link 
                to="/products" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Ver todos los productos
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e) => {
    const maxStock = product.cantidad_disponible || product.inventario_info?.cantidad_disponible || product.stock;
    const value = Math.max(1, Math.min(maxStock, Number(e.target.value)));
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
        {product.categoryName && (
          <>
            <span className="mx-1">/</span>
            <span className="text-gray-700 font-bold">{product.categoryName}</span>
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
            
            {/* Alerta de stock */}
            <div className="mb-4">
              <StockAlert product={product} />
              <div className="mt-2 text-sm text-gray-600">
                {product.en_stock 
                  ? `${product.cantidad_disponible || 'N/A'} unidades disponibles`
                  : 'Producto agotado'
                }
              </div>
            </div>
            
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Cantidad:</span>
              <input
                type="number"
                min={1}
                max={product.cantidad_disponible || product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 border rounded px-2 py-1 text-center"
                disabled={!product.en_stock}
              />
            </div>
            <div className="mb-4">
              <span className="font-semibold text-lg text-red-700">Total:</span>{' '}
              <span className="text-2xl font-bold text-red-600">
                {product.salePrice
                  ? `S/ ${(product.salePrice * quantity).toFixed(2)}`
                  : `S/ ${(product.price * quantity).toFixed(2)}`}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.en_stock}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!product.en_stock
                ? 'Agotado' 
                : 'Agregar al carrito'
              }
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
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map(related => (
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
                    <span className="text-sm text-gray-500">{related.inStock ? 'En stock' : 'Agotado'}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay productos relacionados disponibles.</p>
            <Link 
              to="/products" 
              className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;