import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ordersService from '../services/ordersService';
import api from '../services/api';
import toast from 'react-hot-toast';

const ResumeOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('ResumeOrderPage mounted with orderId:', orderId);
    console.log('User state:', user);
    console.log('Auth loading:', authLoading);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderId, user, authLoading]);
  
  useEffect(() => {
    // Solo hacer la petición si no estamos cargando auth y tenemos usuario
    if (!authLoading && user) {
      const fetchOrderDetails = async () => {
        try {
          console.log('Fetching order details for order:', orderId);
          setLoading(true);
          const orderDetails = await ordersService.getOrderDetails(orderId);
            console.log('Order details response:', orderDetails);
            if (orderDetails && orderDetails.order && orderDetails.order.estado === 'pendiente') {
            setOrder(orderDetails.order);
            console.log('Order set successfully:', orderDetails.order);
            console.log('🔍 Order envios array:', orderDetails.order.envios);
            console.log('🔍 Order envio direct:', orderDetails.order.envio);
            if (orderDetails.order.envios && orderDetails.order.envios.length > 0) {
              console.log('🔍 First envio:', orderDetails.order.envios[0]);
              console.log('🔍 Monto envio:', orderDetails.order.envios[0].monto_envio);
            }
          } else if (orderDetails && orderDetails.order && orderDetails.order.estado !== 'pendiente') {
            setError(`Este pedido tiene estado "${orderDetails.order.estado}" y no puede ser completado`);
          } else {
            setError('Este pedido no está pendiente de pago o ya no existe');
          }
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError('Error al cargar los detalles del pedido');
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else if (!authLoading && !user) {
      console.log('User not authenticated, should redirect to login');
    }
  }, [orderId, user, authLoading]);
  
  const handleResumePurchase = async () => {
    try {
      setLoading(true);
      
      // Reanudar el pedido primero
      await ordersService.resumeOrder(orderId);
        // Recrear la preferencia de Mercado Pago para este pedido usando snapshots
      const items = order.pedido_items.map(item => ({
        title: item.producto_nombre_snapshot || item.producto?.nombre || 'Producto',
        quantity: item.cantidad,
        unit_price: Math.round(parseFloat(item.precio)),
        description: item.producto_descripcion_snapshot || item.producto?.descripcion || undefined,
      }));        // Agregar envío si corresponde (solo si tiene costo > 0)
      const envio = order.envios && order.envios.length > 0 ? order.envios[0] : order.envio;
      if (envio && parseFloat(envio.monto_envio) > 0) {
        items.push({
          title: "Costo de envío",
          quantity: 1,
          unit_price: Math.round(parseFloat(envio.monto_envio)),
          description: "Envío a domicilio"
        });
      }
      
      // Log para debug del total
      const calculatedTotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      console.log('🔍 Items para Mercado Pago:', items);
      console.log('🔍 Total calculado:', calculatedTotal);
      console.log('🔍 Total del pedido:', order.monto_total);
      console.log('🔍 Envío del pedido:', envio);
      
      const mercadoPagoData = {
        items,
        external_reference: orderId.toString(),
        back_urls: {
          success: `${window.location.origin}/register/pago-exitoso?order_id=${orderId}`,
          failure: `${window.location.origin}/register/pago-fallido?order_id=${orderId}`,
          pending: `${window.location.origin}/register/pago-pendiente?order_id=${orderId}`
        }
      };
      
      // Marcar que estamos redirigiendo a Mercado Pago
      sessionStorage.setItem('redirectedToMercadoPago', 'true');
      sessionStorage.setItem('pendingOrderId', orderId);
      
      const response = await api.post('/create-preference', mercadoPagoData);
      
      if (response.init_point) {
        window.location.href = response.init_point;
      } else if (response.sandbox_init_point) {
        window.location.href = response.sandbox_init_point;
      } else {
        throw new Error('No se pudo obtener el punto de inicio de Mercado Pago');
      }
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error(error);
      setLoading(false);
    }
  };
  
  const handleCancelOrder = async () => {
    try {
      await ordersService.cancelOrder(orderId);
      toast.success('Pedido cancelado exitosamente');
      navigate('/orders');
    } catch (error) {
      toast.error('Error al cancelar el pedido');
      console.error(error);
    }
  };
  
  // Función helper para construir URL de imagen correcta
  const getImageUrl = (item) => {
    // Prioridad: snapshot -> producto actual -> placeholder
    let imageUrl = item.producto_imagen_snapshot || item.producto?.url_imagen;
    
    if (!imageUrl) {
      return '/img/placeholder.jpg';
    }
    
    // Si ya es una URL completa, usarla tal como está
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Usar la URL base de la API (removiendo /api/v1)
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    
    // Si es una ruta relativa, construir URL completa del backend
    if (imageUrl.startsWith('/storage/') || imageUrl.startsWith('storage/')) {
      return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    // Si no tiene prefijo de storage, agregarlo
    return `${baseUrl}/storage/${imageUrl.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 pt-24 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error}</h2>
          <Link to="/orders" className="mt-4 inline-block px-4 py-2 bg-green-700 text-white rounded">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Completar pago del {order?.codigo_pedido || `pedido #${orderId}`}
        </h1>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">
            Este pedido está pendiente de pago. Puedes completar tu compra o cancelar el pedido.
          </p>
        </div>
        
        {order && (
          <div className="mb-6">
            <h2 className="font-medium text-lg mb-2">Resumen del pedido:</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.pedido_items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Imagen del producto */}
                          <img
                            src={getImageUrl(item)}
                            alt={item.producto_nombre_snapshot || item.producto?.nombre || 'Producto'}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                            onError={(e) => {
                              e.target.src = '/img/placeholder.jpg';
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.producto_nombre_snapshot || item.producto?.nombre || 'Producto'}
                            </div>                            {/* Mostrar costo de envío junto al primer producto */}
                            {index === 0 && (() => {
                              const envio = order.envios && order.envios.length > 0 ? order.envios[0] : order.envio;
                              if (envio && envio.monto_envio > 0) {
                                return (
                                  <div className="text-sm text-green-600 font-medium">
                                    + Envío: S/ {parseFloat(envio.monto_envio).toFixed(2)}
                                  </div>
                                );
                              } else if (envio && envio.monto_envio === 0) {
                                return (
                                  <div className="text-sm text-green-600 font-medium">
                                    + Envío: GRATIS
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.cantidad}</td>
                      <td className="px-4 py-3 whitespace-nowrap">S/ {parseFloat(item.precio).toFixed(2)}</td>
                    </tr>                  ))}
                  {(() => {
                    const envio = order.envios && order.envios.length > 0 ? order.envios[0] : order.envio;
                    if (envio && envio.monto_envio > 0) {
                      return (
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">Envío</td>
                          <td className="px-4 py-3 whitespace-nowrap">1</td>
                          <td className="px-4 py-3 whitespace-nowrap">S/ {parseFloat(envio.monto_envio).toFixed(2)}</td>
                        </tr>
                      );
                    }
                    return null;
                  })()}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-right font-medium">Total:</td>
                    <td className="px-4 py-3 font-bold">S/ {parseFloat(order.monto_total).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleResumePurchase}
            className="inline-flex items-center justify-center px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Continuar con el pago
          </button>
          
          <button
            onClick={handleCancelOrder}
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar pedido
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/products" 
            className="inline-flex items-center text-green-700 hover:text-green-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeOrderPage;
