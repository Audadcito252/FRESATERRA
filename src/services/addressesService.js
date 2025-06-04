import api from './api.js';

/**
 * Servicio para manejo de direcciones de usuario
 */
class AddressesService {
  /**
   * Obtener todas las direcciones del usuario autenticado
   * @returns {Promise} Lista de direcciones
   */
  async getAddresses() {
    try {
      const response = await api.get('/me/addresses');
      return {
        success: true,
        addresses: response.addresses || [],
        total: response.total || 0,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      throw {
        success: false,
        message: error.message || 'Error al obtener las direcciones',
        status: error.status
      };
    }
  }

  /**
   * Crear una nueva dirección
   * @param {Object} addressData - Datos de la dirección
   * @param {string} addressData.calle - Calle de la dirección
   * @param {string} addressData.numero - Número de la dirección
   * @param {string} addressData.distrito - Distrito
   * @param {string} addressData.ciudad - Ciudad
   * @param {string} addressData.referencia - Referencia opcional
   * @param {boolean} addressData.predeterminada - Si es dirección predeterminada
   * @returns {Promise} Dirección creada
   */  async createAddress(addressData) {
    try {
      // Preparar datos según lo que espera el backend
      const backendData = {
        calle: addressData.calle,
        numero: addressData.numero,
        distrito: addressData.distrito,
        ciudad: addressData.ciudad,
        referencia: addressData.referencia || '',
        predeterminada: addressData.predeterminada || false
      };
      
      // Log de datos que se envían para debugging
      console.log('Enviando datos de dirección:', backendData);
      
      const response = await api.post('/addresses', backendData);
      return {
        success: true,
        address: response.address,
        message: response.message
      };
    } catch (error) {
      console.error('Error al crear dirección:', error);
      
      // Log detallado del error para debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      
      // Manejo específico para errores de validación
      if (error.status === 422 && error.validationErrors) {
        throw {
          success: false,
          message: 'Errores de validación',
          validationErrors: error.validationErrors,
          status: error.status
        };
      }
      
      // Para errores 500, intentar extraer el mensaje del servidor
      if (error.status === 500 && error.response?.data) {
        const serverMessage = error.response.data.message || 
                            error.response.data.error || 
                            error.response.data;
        throw {
          success: false,
          message: typeof serverMessage === 'string' ? serverMessage : 'Error interno del servidor',
          status: error.status,
          serverError: error.response.data
        };
      }
      
      throw {
        success: false,
        message: error.message || 'Error al crear la dirección',
        status: error.status
      };
    }
  }

  /**
   * Actualizar una dirección existente
   * @param {string} addressId - ID de la dirección a actualizar
   * @param {Object} addressData - Datos de la dirección a actualizar
   * @returns {Promise} Dirección actualizada
   */
  async updateAddress(addressId, addressData) {
    try {
      // Preparar datos para el backend (solo enviar campos que han cambiado)
      const backendData = {};
      
      if (addressData.calle !== undefined) backendData.calle = addressData.calle;
      if (addressData.numero !== undefined) backendData.numero = addressData.numero;
      if (addressData.distrito !== undefined) backendData.distrito = addressData.distrito;
      if (addressData.ciudad !== undefined) backendData.ciudad = addressData.ciudad;
      if (addressData.referencia !== undefined) backendData.referencia = addressData.referencia || '';
      if (addressData.predeterminada !== undefined) backendData.predeterminada = addressData.predeterminada;

      console.log('Actualizando dirección:', addressId, backendData);

      const response = await api.put(`/addresses/${addressId}`, backendData);
      return {
        success: true,
        address: response.address,
        message: response.message
      };
    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      if (error.status === 422 && error.validationErrors) {
        throw {
          success: false,
          message: 'Errores de validación',
          validationErrors: error.validationErrors,
          status: error.status
        };
      }
      
      if (error.status === 404) {
        throw {
          success: false,
          message: 'Dirección no encontrada',
          status: error.status
        };
      }
      
      throw {
        success: false,
        message: error.message || 'Error al actualizar la dirección',
        status: error.status
      };
    }
  }

  /**
   * Establecer una dirección como predeterminada
   * @param {string} addressId - ID de la dirección
   * @returns {Promise} Resultado de la operación
   */
  async setAsDefault(addressId) {
    try {
      console.log('Estableciendo dirección como predeterminada:', addressId);

      const response = await api.patch(`/addresses/${addressId}/set-default`);
      return {
        success: true,
        address: response.address,
        message: response.message
      };
    } catch (error) {
      console.error('Error al establecer dirección predeterminada:', error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      
      if (error.status === 404) {
        throw {
          success: false,
          message: 'Dirección no encontrada',
          status: error.status
        };
      }
      
      throw {
        success: false,
        message: error.message || 'Error al establecer dirección predeterminada',
        status: error.status
      };
    }
  }

  /**
   * Obtener la dirección predeterminada del usuario
   * @returns {Promise} Dirección predeterminada o null
   */
  async getDefaultAddress() {
    try {
      const response = await api.get('/addresses/default');
      return {
        success: true,
        address: response.address,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener dirección predeterminada:', error);
      
      // No es un error si no hay dirección predeterminada
      if (error.status === 200 && error.response?.data?.address === null) {
        return {
          success: true,
          address: null,
          message: 'No hay dirección predeterminada configurada'
        };
      }
      
      throw {
        success: false,
        message: error.message || 'Error al obtener la dirección predeterminada',
        status: error.status
      };
    }
  }

  /**
   * Validar datos de dirección antes de enviar
   * @param {Object} addressData - Datos a validar
   * @returns {Object} Resultado de validación
   */
  validateAddressData(addressData) {
    const errors = {};

    if (!addressData.calle || addressData.calle.trim().length < 5) {
      errors.calle = 'La calle debe tener al menos 5 caracteres';
    }

    if (!addressData.numero || addressData.numero.trim().length === 0) {
      errors.numero = 'El número es requerido';
    }

    if (!addressData.distrito || addressData.distrito.trim().length < 3) {
      errors.distrito = 'El distrito debe tener al menos 3 caracteres';
    }

    if (!addressData.ciudad || addressData.ciudad.trim().length < 3) {
      errors.ciudad = 'La ciudad debe tener al menos 3 caracteres';
    }

    if (addressData.referencia && addressData.referencia.length > 255) {
      errors.referencia = 'La referencia no puede exceder 255 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Exportar instancia única del servicio
const addressesService = new AddressesService();
export default addressesService;
