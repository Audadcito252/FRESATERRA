import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, loading } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="text-gray-600">Cargando carrito...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 flex items-start justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight text-gray-900">Tu Carrito</h1>        {cartItems?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
            <button 
              onClick={() => navigate('/products')}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(({ id, product, quantity }) => (
              <div key={id} className="flex items-center gap-4 bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-lg transition-shadow">
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg border" />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-gray-500 text-sm">Precio unitario: S/ {product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => updateQuantity(id, quantity - 1)} 
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="px-3 text-base font-medium">{quantity}</span>
                    <button 
                      onClick={() => updateQuantity(id, quantity + 1)} 
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
                      disabled={loading}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(id)} 
                      className="ml-4 text-red-600 hover:underline text-sm"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right min-w-[90px]">
                  <span className="font-bold text-gray-800 text-lg">
                    S/ {(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="mt-8 bg-white rounded-xl shadow p-6 border border-gray-100">
              <div className="flex justify-between items-center py-2 border-b mb-4">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-gray-900">S/ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
                <button 
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  onClick={() => navigate('/products')}
                >
                  Continuar comprando
                </button>
                <button 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceder al pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;