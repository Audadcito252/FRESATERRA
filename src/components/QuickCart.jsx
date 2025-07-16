import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { X, Truck, AlertTriangle } from 'lucide-react';
import stockService from '../services/stockService';
import toast from 'react-hot-toast';

const QuickCart = ({ open, onClose }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, loading: cartLoading, checkCartStock, addingToCart } = useShoppingCart();
  const [loading, setLoading] = useState(false);
  const [stockIssues, setStockIssues] = useState([]);
  
  // Verificar stock cuando se abre el carrito
  useEffect(() => {
    if (open && cartItems.length > 0) {
      const verifyStock = async () => {
        try {
          const stockCheck = await checkCartStock();
          if (!stockCheck.success && stockCheck.unavailableItems) {
            setStockIssues(stockCheck.unavailableItems);
          } else {
            setStockIssues([]);
          }
        } catch (error) {
          console.error('Error verificando stock:', error);
        }
      };
      verifyStock();
    }
  }, [open, cartItems, checkCartStock]);
  
  // Verificar si aplica la oferta de envío gratis (total >= S/ 30)
  const FREE_SHIPPING_THRESHOLD = 30;
  const hasQualifiedForFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const freeShippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  
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
        </div>        <div className="flex-1 overflow-y-auto p-4 space-y-4">          {cartLoading || loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Cargando...</span>
            </div>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">Tu carrito está vacío</p>
          ) : (
            cartItems.map(({ id, product, quantity }) => {
              // Verificar si este producto tiene problemas de stock
              const stockIssue = stockIssues.find(issue => issue.producto_id === id);
              
              return (
                <div key={id} className="flex items-center gap-3 border-b pb-3">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md border" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-500">S/ {product.price.toFixed(2)} c/u</p>
                    
                    {/* Alerta de stock */}
                    {stockIssue && (
                      <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Solo {stockIssue.cantidad_disponible} disponibles</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(id, quantity - 1)} 
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
                        disabled={loading || quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2 text-sm">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(id, quantity + 1)} 
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
                        disabled={loading || (stockIssue && quantity >= stockIssue.cantidad_disponible)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className="font-bold text-gray-800 text-sm">
                      S/ {(product.price * quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(id)} 
                      className="block text-xs text-red-600 hover:underline mt-1"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 border-t">
          {cartItems.length > 0 && (
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Truck size={16} className="mr-2 text-green-600" />
                <span className="text-sm font-medium">
                  {hasQualifiedForFreeShipping 
                    ? "¡Envío GRATIS aplicado!" 
                    : `Añade S/ ${amountToFreeShipping.toFixed(2)} más para envío GRATIS`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${hasQualifiedForFreeShipping ? 'bg-green-600' : 'bg-red-600'}`}
                  style={{ width: `${freeShippingProgress}%` }}></div>
              </div>
            </div>
          )}          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">S/ {cartTotal.toFixed(2)}</span>
          </div>
          {cartItems.length > 0 && (
            <button              onClick={async () => {
                if(window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                  try {
                    setLoading(true);
                    await clearCart();
                    toast.success('Carrito vaciado exitosamente');
                  } catch (error) {
                    console.error('Error:', error);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              className="block w-full text-center py-2 mb-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Vaciar carrito
            </button>
          )}
          
          {/* Alerta general de stock */}
          {stockIssues.length > 0 && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">
                  {stockIssues.length === 1 
                    ? 'Un producto tiene stock limitado' 
                    : `${stockIssues.length} productos tienen stock limitado`
                  }
                </span>
              </div>
            </div>
          )}
          
          <Link
            to="/cart"
            className="block w-full text-center py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Ver carrito completo
          </Link>
          
          {/* Botón inteligente de checkout */}
          <Link
            to={stockIssues.length > 0 ? "/cart" : "/checkout"}
            className={`block w-full text-center py-2 mt-2 rounded-lg font-semibold transition-colors ${
              stockIssues.length > 0 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            onClick={onClose}
          >
            {stockIssues.length > 0 ? 'Revisar problemas de stock' : 'Finalizar compra'}
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default QuickCart;
