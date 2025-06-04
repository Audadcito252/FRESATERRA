import api from './api';

export const addressService = {  // Obtener todas las direcciones del usuario
  getAddresses: async () => {
    try {
      const response = await api.get('/addresses');
      console.log('Respuesta completa del API getAddresses:', response);
      
      // La respuesta es directamente el objeto de la API Laravel
      // Puede ser: { success: true, addresses: [...] } o simplemente [...]
      
      if (response && response.addresses) {
        console.log('Devolviendo response.addresses:', response.addresses);
        return response.addresses;
      }
      
      if (Array.isArray(response)) {
        console.log('Respuesta es array directo:', response);
        return response;
      }
      
      if (response && response.success === true && !response.addresses) {
        console.log('Success true pero sin addresses, devolviendo array vacío');
        return [];
      }
      
      // Si no hay ninguna estructura reconocida, devolver array vacío
      console.log('Estructura no reconocida, devolviendo array vacío');
      return [];
    } catch (error) {
      console.error('Error obteniendo direcciones:', error);
      console.error('Respuesta del error:', error.response?.data);
      throw error;
    }
  },// Crear nueva dirección
  createAddress: async (addressData) => {
    try {
      console.log('Enviando datos de dirección:', addressData);
      const response = await api.post('/addresses', addressData);
      console.log('Respuesta completa de createAddress:', response);
      
      // La respuesta es directamente el objeto { success: true, message: "...", address: {...} }
      if (response && response.success === true) {
        console.log('Dirección creada exitosamente');
        if (response.address) {
          console.log('Devolviendo response.address:', response.address);
          return response.address;
        } else {
          // Si no hay address en la respuesta, devolver los datos originales con ID temporal
          console.log('No hay address en respuesta, usando datos originales');
          return { ...addressData, id: Date.now() };
        }
      }
      
      // Fallback para casos inesperados
      console.log('Estructura de respuesta inesperada, usando fallback');
      return { ...addressData, id: Date.now() };
      
    } catch (error) {
      console.error('Error en createAddress:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },  // Establecer como predeterminada
  setDefaultAddress: async (id) => {
    try {
      const response = await api.patch(`/addresses/${id}/set-default`);
      console.log('Respuesta de setDefaultAddress:', response);
      
      // La respuesta es directamente { success: true, message: "..." }
      return response;
    } catch (error) {
      console.error('Error estableciendo dirección predeterminada:', error);
      throw error;
    }
  },  // Obtener dirección predeterminada
  getDefaultAddress: async () => {
    try {
      const response = await api.get('/addresses/default');
      console.log('Respuesta de getDefaultAddress:', response);
      
      // La respuesta es directamente { success: true, address: {...} }
      if (response && response.success === true) {
        return response.address;
      }
      
      return response;
    } catch (error) {
      console.error('Error obteniendo dirección predeterminada:', error);
      throw error;
    }
  }
};
