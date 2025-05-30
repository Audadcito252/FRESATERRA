import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useShoppingCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Verificar que cartItems tiene id y es único
  // console.log(cartItems);

  return (
    <div className="min-h-screen pt-24 flex items-start justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight text-gray-900">Tu Carrito</h1>
        {cartItems?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(({ id, product, quantity }) => (
              <div key={id} className="flex items-center gap-4 bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-lg transition-shadow">
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg border" />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-gray-500 text-xs mb-2">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
                      aria-label={`Disminuir cantidad de ${product.name}`}
                    >
                      -
                    </button>
                    <span className="px-3 text-base">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
                      aria-label={`Aumentar cantidad de ${product.name}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="ml-4 text-red-600 hover:underline text-xs"
                      aria-label={`Eliminar ${product.name} del carrito`}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right min-w-[90px]">
                  <span className="font-bold text-gray-800 text-lg">
                    S/ {( (product.salePrice || product.price) * quantity ).toFixed(2)}
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
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
                <button
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  onClick={handleCheckout}
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
