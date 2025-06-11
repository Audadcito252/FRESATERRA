import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MessageSquare } from 'lucide-react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ProductCard = ({ product }) => {
  // Función para asegurar que el valor sea numérico
  const ensureNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Función para construir la URL de la imagen correctamente
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Si ya es una URL completa, la devolvemos tal cual
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Eliminar 'storage/' del inicio si existe
    const cleanPath = imagePath.startsWith('storage/') 
      ? imagePath.substring(8) 
      : imagePath;

    // Construir la URL final
    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  };

  // Valores por defecto para evitar errores
  const safeProduct = {
    id: product?.id || product?.id_producto || '',
    name: product?.nombre || product?.name || 'Producto sin nombre',
    description: product?.descripcion || product?.description || 'Descripción no disponible',
    price: ensureNumber(product?.precio || product?.price, 0),
    salePrice: ensureNumber(product?.salePrice || product?.precio_oferta, null),
    images: product?.url_imagen 
      ? [buildImageUrl(product.url_imagen)]
      : product?.images?.map(img => buildImageUrl(img)) || [],
    stock: ensureNumber(product?.stock, 0),
    featured: product?.featured || product?.destacado || false,
    reviews: product?.reviews || product?.reseñas || [],
    averageRating: ensureNumber(product?.averageRating || product?.valoracion_promedio, 0),
    categorias_id_categoria: product?.categorias_id_categoria || null
  };

  const { addToCart } = useShoppingCart();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(safeProduct.images[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Verifica si el usuario ha dejado una reseña para este producto
  const hasUserReview = user && safeProduct.reviews.some(review => review.userId === user.id);

  // Determinar si el producto está disponible basado en el stock
  const isProductAllowed = safeProduct.stock > 0;

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/cart', {
        producto_id: safeProduct.id,
        cantidad: 1
      });
      // Mostrar notificación de éxito
      toast.success(`${safeProduct.name} agregado al carrito`);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      setError('Error al agregar al carrito');
    } finally {
      setLoading(false);
    }
  };

  // Calculate discount percentage if there's a sale price
  const discountPercentage = safeProduct.salePrice && safeProduct.price > 0
    ? Math.round(((safeProduct.price - safeProduct.salePrice) / safeProduct.price) * 100)
    : 0;

  const handleCardClick = (e) => {
    if (!isProductAllowed) {
      e.preventDefault();
      e.stopPropagation();
      toast.error('Este producto no está disponible temporalmente');
      return;
    }
  };

  // Función segura para formatear precios
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '0.00';
    return price.toFixed(2);
  };

  return (
    <div 
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${
        !isProductAllowed ? 'opacity-60' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Featured Badge */}
      {safeProduct.featured && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          Presentado
        </div>
      )}

      {/* Badge de No Disponible */}
      {!isProductAllowed && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-md">
          Sin Stock
        </div>
      )}

      <Link 
        to={isProductAllowed ? `/products/${safeProduct.id}` : '#'}
        onClick={handleCardClick}
        className={isProductAllowed ? '' : 'cursor-not-allowed pointer-events-none'}
      >
        {/* Product Image */}
        <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
          {currentImageUrl && !imageError ? (
            <img
              src={currentImageUrl}
              alt={safeProduct.name}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                isHovered && isProductAllowed ? 'scale-110' : 'scale-100'
              }`}
              onError={(e) => {
                // Si la URL actual ya es la alternativa, mostrar el fallback
                if (currentImageUrl === `http://127.0.0.1:8000/storage/${safeProduct.url_imagen}`) {
                  setImageError(true);
                } else {
                  // Intentar con la URL alternativa
                  const alternativeUrl = `http://127.0.0.1:8000/storage/${safeProduct.url_imagen}`;
                  setCurrentImageUrl(alternativeUrl);
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Imagen no disponible
            </div>
          )}
          
          {/* agregar al carrito boton */}
          <div className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={!isProductAllowed || loading}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                isProductAllowed 
                  ? loading 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-200'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
            >
              <ShoppingCart size={16} className="mr-2" />
              {loading ? (
                <span className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></span>
              ) : isProductAllowed ? 'Agregar al carrito' : 'No disponible'}
            </button>
          </div>
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 line-clamp-1">{safeProduct.name}</h3>          
          {/* Ratings */}
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.round(safeProduct.averageRating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-500">
              ({safeProduct.reviews.length})
            </span>
            {/* Indicador de reseña del usuario */}
            {hasUserReview && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full flex items-center">
                <MessageSquare size={12} className="mr-1" />
                Tu reseña
              </span>
            )}
          </div>
          
          {/* Price */}
          <div className="mt-2 flex items-center">
            {safeProduct.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">S/ {formatPrice(safeProduct.salePrice)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">S/ {formatPrice(safeProduct.price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">S/ {formatPrice(safeProduct.price)}</span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="mt-2 text-sm">
            {!isProductAllowed ? (
              <span className="text-red-600 font-medium">Producto no disponible</span>
            ) : safeProduct.stock > 10 ? (
              <span className="text-green-600">En stock</span>
            ) : safeProduct.stock > 0 ? (
              <span className="text-orange-500">Bajo Stock ({safeProduct.stock} cantidad)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;