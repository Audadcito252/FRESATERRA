import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { X } from 'lucide-react';

const QuickCart = ({ open, onClose }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useShoppingCart();
  
  // Bloquear el scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Slide-in panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Carrito rápido</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">Tu carrito está vacío</p>
          ) : (
            cartItems.map(({ id, product, quantity }) => (
              <div key={id} className="flex items-center gap-3 border-b pb-3">
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md border" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(id, quantity - 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                    <span className="px-2">{quantity}</span>
                    <button onClick={() => updateQuantity(id, quantity + 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                  </div>
                </div>
                <div className="text-right min-w-[60px]">
                  <span className="font-bold text-gray-800 text-sm">
                    S/ {((product.salePrice || product.price) * quantity).toFixed(2)}
                  </span>
                  <button onClick={() => removeFromCart(id)} className="block text-xs text-red-600 hover:underline mt-1">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">S/ {cartTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/cart"
            className="block w-full text-center py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Ver carrito completo
          </Link>
          <Link
            to="/checkout"
            className="block w-full text-center py-2 mt-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            onClick={onClose}
          >
            Finalizar compra
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default QuickCart;
