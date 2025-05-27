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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  // Calculate discount percentage if there's a sale price
  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

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
          Featured
        </div>
      )}

      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Quick Add To Cart Button */}
          <div className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
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
            {product.stock > 10 ? (
              <span className="text-green-600">En stock</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500">Low Stock ({product.stock} left)</span>
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