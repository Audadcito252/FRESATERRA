import React, { useState } from 'react';
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
  const hasUserReview =
    user &&
    product.reviews &&
    product.reviews.some((review) => review.userId === user.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  // Calculate discount percentage if there's a sale price
  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Rating (fallback a 0)
  const averageRating = product.averageRating || 0;

  // Stock (fallback a 0)
  const stock = product.stock ?? 0;

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
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

      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Agregar al carrito botón */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 transform transition-transform duration-300 ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <ShoppingCart size={16} className="mr-2" />
              Agregar al carrito
            </button>
          </div>
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {/* Estrellas */}
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}

              {/* Reseña ícono y texto */}
              <div className="ml-2 flex items-center space-x-1">
                <MessageSquare
                  size={14}
                  className={`${
                    hasUserReview ? 'text-green-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    hasUserReview ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {hasUserReview ? 'Reseñado' : 'Sin reseña'}
                </span>
              </div>
            </div>

            <div className="text-right">
              {product.salePrice ? (
                <div className="space-x-2">
                  <span className="text-red-600 font-semibold">
                    S/ {product.salePrice.toFixed(2)}
                  </span>
                  <span className="line-through text-gray-400 text-sm">
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-semibold text-gray-900">S/ {product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          {stock === 0 && (
            <p className="mt-2 text-xs text-red-600 font-semibold">Agotado</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
