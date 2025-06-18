import api from './api';

/**
 * Servicio para gestionar pagos
 */
const paymentsService = {
  /**
   * Obtener métodos de pago activos
   */
  getPaymentMethods: async () => {
    try {
      return await api.get('/payments/methods');
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      throw error;
    }
  },

  /**
   * Obtener historial de pagos del usuario
   */
  getUserPayments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros como parámetros de consulta
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/payments?${queryString}` : '/payments';
      
      return await api.get(url);
    } catch (error) {
      console.error('Error obteniendo historial de pagos:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo pago
   */
  createPayment: async (paymentData) => {
    try {
      return await api.post('/payments', paymentData);
    } catch (error) {
      console.error('Error creando pago:', error);
      throw error;
    }
  },

  /**
   * Obtener detalles de un pago específico
   */
  getPaymentDetails: async (paymentId) => {
    try {
      return await api.get(`/payments/${paymentId}`);
    } catch (error) {
      console.error('Error obteniendo detalles del pago:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de pago
   */
  updatePaymentStatus: async (paymentId, statusData) => {
    try {
      return await api.patch(`/payments/${paymentId}/status`, statusData);
    } catch (error) {
      console.error('Error actualizando estado del pago:', error);
      throw error;
    }
  },
  /**
   * Confirmar pago (webhook de Mercado Pago)
   */
  confirmPayment: async (paymentData) => {
    try {
      return await api.post('/payments/confirm', paymentData);
    } catch (error) {
      console.error('Error confirmando pago:', error);
      throw error;
    }
  },

  /**
   * Confirmar pago exitoso al regresar de Mercado Pago
   */
  handlePaymentSuccess: async (successData) => {
    try {
      return await api.post('/payments/success', successData);
    } catch (error) {
      console.error('Error confirmando pago exitoso:', error);
      throw error;
    }
  },/**
   * Obtener información de pago por pedido
   */
  getPaymentByOrder: async (orderId) => {
    try {
      return await api.get(`/orders/${orderId}/payment`);
    } catch (error) {
      console.error('Error obteniendo información de pago del pedido:', error);
      throw error;
    }
  }
};

export default paymentsService;
