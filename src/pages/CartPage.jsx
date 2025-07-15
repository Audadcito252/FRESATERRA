import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import { Truck, AlertTriangle } from 'lucide-react';
import stockService from '../services/stockService';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, loading, checkCartStock } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stockIssues, setStockIssues] = useState([]);
  const [checkingStock, setCheckingStock] = useState(false);

  // Verificar si aplica la oferta de envío gratis (total >= S/ 30)
  const FREE_SHIPPING_THRESHOLD = 30;
  const hasQualifiedForFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const freeShippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Verificar stock cuando se carga la página o cambian los items del carrito
  useEffect(() => {
    if (cartItems.length > 0) {
      const verifyStock = async () => {
        try {
          setCheckingStock(true);
          const stockCheck = await checkCartStock();
          if (!stockCheck.success && stockCheck.unavailableItems) {
            setStockIssues(stockCheck.unavailableItems);
          } else {
            setStockIssues([]);
          }
        } catch (error) {
          console.error('Error verificando stock:', error);
        } finally {
          setCheckingStock(false);
        }
      };
      verifyStock();
    } else {
      setStockIssues([]);
    }
  }, [cartItems, checkCartStock]);

  const handleCheckout = async () => {
    // Verificar stock antes de ir al checkout
    setCheckingStock(true);
    const stockCheck = await checkCartStock();
    setCheckingStock(false);
    
    if (!stockCheck.success) {
      toast.error('Algunos productos no tienen stock suficiente. Por favor revisa tu carrito.');
      return;
    }
    
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
            {cartItems.map(({ id, product, quantity }) => {
              // Verificar si este producto tiene problemas de stock
              const stockIssue = stockIssues.find(issue => issue.producto_id === id);
              
              return (
                <div key={id} className="flex items-center gap-4 bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-lg transition-shadow">
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h2>
                    <p className="text-gray-500 text-sm">Precio unitario: S/ {product.price.toFixed(2)}</p>
                    
                    {/* Alerta de stock */}
                    {stockIssue && (
                      <div className="flex items-center gap-2 text-sm text-red-600 mt-1 p-2 bg-red-50 rounded-md">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">
                          Solo {stockIssue.cantidad_disponible} unidades disponibles
                        </span>
                      </div>
                    )}
                    
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
              );
            })}
            
            <div className="mt-8 bg-white rounded-xl shadow p-6 border border-gray-100">
              {/* Free shipping progress indicator */}
              <div className="mb-5 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Truck size={20} className={hasQualifiedForFreeShipping ? "text-green-600" : "text-gray-600"} />
                  <h3 className="font-medium text-lg">
                    {hasQualifiedForFreeShipping 
                      ? "¡Genial! Tu pedido califica para envío GRATIS" 
                      : "¡Añade más productos para obtener envío GRATIS!"}
                  </h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${hasQualifiedForFreeShipping ? 'bg-green-600' : 'bg-red-600'}`}
                    style={{ width: `${freeShippingProgress}%` }}>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {hasQualifiedForFreeShipping
                    ? "¡Envío GRATIS aplicado a tu pedido!"
                    : `Añade S/ ${amountToFreeShipping.toFixed(2)} más a tu pedido para obtener envío GRATIS`}
                </p>
              </div>

              <div className="flex justify-between items-center py-2 border-b mb-4">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-gray-900">S/ {cartTotal.toFixed(2)}</span>
              </div>
              
              {/* Alerta general de stock */}
              {stockIssues.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">
                      {stockIssues.length === 1 
                        ? 'Un producto en tu carrito tiene stock limitado' 
                        : `${stockIssues.length} productos en tu carrito tienen stock limitado`
                      }
                    </span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    Revisa las cantidades antes de proceder al checkout.
                  </p>
                </div>
              )}
              
              {checkingStock && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Verificando disponibilidad...</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-4">
                <button 
                  className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-100 transition-colors"                  onClick={async () => {
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
                  disabled={loading || cartItems.length === 0}
                >
                  Vaciar carrito
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    onClick={() => navigate('/products')}
                  >
                    Continuar comprando
                  </button>
                  <button 
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      stockIssues.length > 0 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || checkingStock}
                  >
                    {checkingStock 
                      ? 'Verificando...' 
                      : stockIssues.length > 0 
                        ? 'Revisar y continuar' 
                        : 'Proceder al pago'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;