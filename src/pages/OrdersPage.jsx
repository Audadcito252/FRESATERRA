import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Package, Truck } from 'lucide-react';

function OrdersPage() {
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'En camino':
        return 'bg-blue-100 text-blue-800';
      case 'Procesando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Entregado':
        return <Package size={18} />;
      case 'En camino':
        return <Truck size={18} />;
      case 'Procesando':
        return <ShoppingCart size={18} />;
      default:
        return <ShoppingCart size={18} />;
    }
  };

  return (
    <div className="pt-32 md:pt-40 container mx-auto px-4 pb-16">
      <h1 className="text-3xl font-bold mb-6">Tus Pedidos</h1>
      
      {user?.orders?.length > 0 ? (
        <div className="space-y-6">
          {user.orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm">Pedido #</span>
                    <h2 className="font-semibold">{order.id}</h2>
                    <span className="text-gray-500 text-sm">{order.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-sm">Total</span>
                    <p className="font-semibold">S/ {order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <h3 className="font-medium mb-3">Productos</h3>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="flex-1">
                        <p className="text-sm">{item.name} <span className="text-gray-500">x{item.quantity}</span></p>
                      </div>
                      <div className="text-sm font-medium">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-600">
            <p>No se encontraron pedidos.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;