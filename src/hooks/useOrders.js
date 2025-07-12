import { useState, useEffect, useCallback } from 'react';
import ordersService from '../services/ordersService';

/**
 * Hook para manejar pedidos del usuario
 */
const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Función para obtener pedidos del usuario
  const fetchOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);      try {
      const response = await ordersService.getUserOrders(filters);
      console.log('🔍 API Response:', response); // Debug log
      
      // Verificar la estructura de la respuesta y normalizar los datos
      // El interceptor de api.js ya devuelve response.data, así que 'response' es directamente el objeto de datos
      if (response && response.orders) {
        const ordersData = response.orders;
        console.log('📦 Orders Data:', ordersData); // Debug log
          // Normalizar la estructura de datos para compatibilidad con el frontend
        const normalizedOrders = Array.isArray(ordersData) ? ordersData.map(order => {
          console.log('🔧 Processing order:', order); // Debug log
          console.log('🔧 Order pedido_items:', order.pedido_items); // Debug log específico para items
            // Registrar información sobre la dirección para depuración
          if (Array.isArray(order.envios) && order.envios.length > 0) {
            console.log('🏠 Dirección en envio:', order.envios[0].direccion);
          } else if (order.envio) {
            console.log('🏠 Dirección en envio singular:', order.envio.direccion);
          }
          
          // Normalizar el objeto orden
          return {
            ...order,
            // Mapear pedido_items a detalles para consistencia
            detalles: order.pedido_items || order.detalles || [],
            // Mapear envios a envio (tomar el primer envío si hay múltiples)
            envio: Array.isArray(order.envios) ? order.envios[0] : order.envio || order.envios,
            // Mapear pagos a pago (tomar el primer pago si hay múltiples)
            pago: Array.isArray(order.pagos) ? order.pagos[0] : order.pago || order.pagos,
            // 🔧 DEBUG: Log del estado del envío
            ...(console.log(`🚚 Debug envío para pedido ${order.id_pedido}:`, {
              envio_directo: order.envio,
              envios_array: order.envios,
              envio_estado: order.envio?.estado || (Array.isArray(order.envios) ? order.envios[0]?.estado : 'no encontrado')
            }) || {}),
            // Asegurar que referencia_pago esté disponible
            referencia_pago: order.referencia_pago || 
                            (Array.isArray(order.pagos) && order.pagos[0]?.referencia_pago) ||
                            (order.pago?.referencia_pago) ||
                            null
          };
        }) : [];
          console.log('✅ Normalized Orders:', normalizedOrders); // Debug log
        console.log('📊 Orders count:', normalizedOrders.length); // Debug log
        
        setOrders(normalizedOrders);
      } else {
        console.log('❌ Invalid response structure:', response); // Debug log
        console.log('❌ Expected response.orders but got:', typeof response, Object.keys(response || {}));
        setOrders([]);
      }} catch (err) {
      console.error('❌ Error fetching orders:', err);
      console.error('❌ Error response:', err.response);
      setError(err.response?.data?.error || err.message || 'Error al cargar pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);
  // Función para obtener detalles de un pedido específico
  const getOrderDetails = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.getOrderDetails(orderId);
      console.log('🔍 Order details response:', response);
      
      // The API interceptor already returns response.data, so 'response' is the actual data
      // Check if response has the expected structure
      if (response && response.order) {
        return response.order;
      } else if (response && response.data && response.data.order) {
        return response.data.order;
      } else {
        // If response structure is unexpected, return the response itself
        return response;
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.error || err.message || 'Error al cargar detalles del pedido');
      throw err; // Re-throw to allow proper error handling in the component
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Función para formatear el estado del pedido
  const formatOrderStatus = useCallback((status) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado', 
      'preparando': 'Preparando',
      'en_camino': 'En camino',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    
    return statusMap[status] || status;
  }, []);

  // Función para obtener la clase CSS del estado
  const getStatusClass = useCallback((status) => {
    const statusClasses = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'preparando': 'bg-purple-100 text-purple-800',
      'en_camino': 'bg-indigo-100 text-indigo-800',
      'entregado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }, []);
  // Función para formatear fecha
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  }, []);

  // Función para obtener el nombre del método de pago
  const getPaymentMethodName = useCallback((order) => {
    if (!order) return 'No especificado';
    
    // Intentar obtener el nombre del método de pago desde las relaciones
    if (order.pagos && Array.isArray(order.pagos) && order.pagos.length > 0) {
      const pago = order.pagos[0];
      if (pago.metodos_pago && pago.metodos_pago.nombre) {
        return pago.metodos_pago.nombre;
      }
    }
    
    // Si no hay relación, intentar con el pago singular
    if (order.pago && order.pago.metodos_pago && order.pago.metodos_pago.nombre) {
      return order.pago.metodos_pago.nombre;
    }
    
    // Fallback a referencia_pago o 'No especificado'
    return order.referencia_pago || 'No especificado';
  }, []);

  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrderDetails,
    clearError,
    formatOrderStatus,
    getStatusClass,
    formatDate,
    getPaymentMethodName,
    hasOrders: orders.length > 0
  };
};

export default useOrders;
