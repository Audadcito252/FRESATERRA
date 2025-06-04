import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MessageSquare } from 'lucide-react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useShoppingCart();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
    // Verifica si el usuario ha dejado una reseña para este producto
  const hasUserReview = user && product.reviews.some(review => review.userId === user.id);

  // Lista de productos permitidos para agregar al carrito
  const allowedProductIds = ['1', '2', '3']; // Delicia Andina - 1kg, Doble Dulzura - 2kg, Frescura Familiar - 5kg
  const isProductAllowed = allowedProductIds.includes(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isProductAllowed) {
      toast.error('Este producto no está disponible para compra en este momento');
      return;
    }
    
    addToCart(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  // Calculate discount percentage if there's a sale price
  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const handleCardClick = (e) => {
    if (!isProductAllowed) {
      e.preventDefault();
      e.stopPropagation();
      toast.error('Este producto no está disponible para ver detalles en este momento');
      return;
    }
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
      {product.featured && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          Presentado
        </div>
      )}

      {/* Badge de No Disponible */}
      {!isProductAllowed && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-md">
          No Disponible
        </div>
      )}

      <Link 
        to={isProductAllowed ? `/products/${product.id}` : '#'}
        onClick={handleCardClick}
        className={isProductAllowed ? '' : 'cursor-not-allowed pointer-events-none'}
      >
        {/* Product Image */}
        <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
              isHovered && isProductAllowed ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* agregar al carrito boton */}
          <div className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={!isProductAllowed}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                isProductAllowed 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
            >
              <ShoppingCart size={16} className="mr-2" />
              {isProductAllowed ? 'Agregar al carrito' : 'No disponible'}
            </button>
          </div>
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 line-clamp-1">{product.name}</h3>          
          {/* Ratings */}
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.round(product.averageRating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-500">
              ({product.reviews.length})
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
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">S/ {product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">S/ {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">S/ {product.price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="mt-2 text-sm">
            {!isProductAllowed ? (
              <span className="text-red-600 font-medium">Producto no disponible</span>
            ) : product.stock > 10 ? (
              <span className="text-green-600">En stock</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500">Bajo Stock ({product.stock} cantidad)</span>
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