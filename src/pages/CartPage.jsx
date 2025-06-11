import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import CartItem from '../components/CartItem';
import api from '../api/axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
      setError('Error al cargar el carrito. Por favor, intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await api.put(`/cart/${itemId}`, { cantidad: newQuantity });
      fetchCart(); // Recargar el carrito
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      setError('Error al actualizar la cantidad. Por favor, intente más tarde.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart(); // Recargar el carrito
    } catch (err) {
      console.error('Error al eliminar item:', err);
      setError('Error al eliminar el producto. Por favor, intente más tarde.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={fetchCart} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cart.items || cart.cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">¡Agrega algunos productos para comenzar!</p>
          <Link 
            to="/products" 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {cart.cart.items.map(item => (
              <CartItem
                key={item.id_item_carrito}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>S/ {cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Calculado al finalizar</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>S/ {cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {/* Implementar checkout */}}
            >
              Proceder al pago
            </button>
            <Link 
              to="/products"
              className="block text-center mt-4 text-red-600 hover:text-red-700"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;