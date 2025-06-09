import api from './api';

/**
 * Servicio para gestionar pedidos
 */
const ordersService = {
  /**
   * Obtener pedidos del usuario
   */
  getUserOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros como parámetros de consulta
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/orders?${queryString}` : '/orders';
      
      return await api.get(url);
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      throw error;
    }
  },
  /**
   * Crear nuevo pedido desde checkout
   * @param {Object} checkoutData - Datos del checkout
   * @param {Array} checkoutData.items - Array de productos con cantidad
   * @param {Object} checkoutData.shipping_info - Información de envío
   * @param {Object} checkoutData.address_info - Información de dirección
   * @param {number} checkoutData.monto_total - Total del pedido
   * @param {string} checkoutData.notes - Notas adicionales (opcional)
   */
  createOrder: async (checkoutData) => {
    try {
      // Validar que los datos requeridos estén presentes
      if (!checkoutData.items || !Array.isArray(checkoutData.items) || checkoutData.items.length === 0) {
        throw new Error('Los items del pedido son requeridos');
      }

      if (!checkoutData.shipping_info) {
        throw new Error('La información de envío es requerida');
      }

      if (!checkoutData.address_info) {
        throw new Error('La información de dirección es requerida');
      }

      if (!checkoutData.monto_total || checkoutData.monto_total <= 0) {
        throw new Error('El monto total del pedido es requerido');
      }      console.log('Creando pedido con datos:', checkoutData);
      const response = await api.post('/orders', checkoutData);
      
      // Devolver directamente los datos de la respuesta
      return response.data || response;
    } catch (error) {
      console.error('Error creando pedido:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      
      // Re-throw the error with better information
      if (error.response?.data) {
        const enhancedError = new Error(error.message);
        enhancedError.response = error.response;
        enhancedError.status = error.response.status;
        enhancedError.data = error.response.data;
        throw enhancedError;
      }
      throw error;
    }
  },

  /**
   * Obtener detalles de un pedido específico
   */
  getOrderDetails: async (orderId) => {
    try {
      return await api.get(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error obteniendo detalles del pedido:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de pedido
   */
  updateOrderStatus: async (orderId, statusData) => {
    try {
      return await api.patch(`/orders/${orderId}/status`, statusData);
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error);
      throw error;
    }
  },

  /**
   * Cancelar pedido
   */
  cancelOrder: async (orderId, reason = '') => {
    try {
      return await api.patch(`/orders/${orderId}/cancel`, { reason });
    } catch (error) {
      console.error('Error cancelando pedido:', error);
      throw error;
    }
  }
};

export default ordersService;
