import api from './api';

export const reviewsService = {  // Obtener todas las reseñas de un producto
  getProductReviews: async (productId) => {
    try {      const response = await api.get(`/productos/${productId}/reviews`);
      
      // Check if response.data has the expected structure
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      } else if (response.data && response.data.reviews !== undefined) {
        // Direct data structure
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: 'Estructura de respuesta inesperada'
        };
      }
    } catch (error) {
      console.error('Error getting product reviews:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener las reseñas'
      };
    }
  },  // Obtener la reseña del usuario actual para un producto
  getUserReview: async (productId) => {
    try {
      const response = await api.get(`/productos/${productId}/my-review`);
        // Check if response.data has the expected structure
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      } else if (response.data && response.data.id_resena !== undefined) {
        // Direct data structure
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: 'Estructura de respuesta inesperada'
        };
      }
    } catch (error) {
      // El 404 es esperado cuando el usuario no tiene reseña - no es un error real
      if (error.response?.status === 404) {
        return {
          success: true,
          notFound: true,
          data: null,
          message: 'No tienes una reseña para este producto'
        };
      }
      
      // Solo logueamos otros tipos de error
      console.error('Error getting user review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener tu reseña'
      };
    }
  },

  // Crear una nueva reseña
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la reseña',
        errors: error.response?.data?.errors
      };
    }
  },

  // Actualizar una reseña existente
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar la reseña',
        errors: error.response?.data?.errors
      };
    }
  },

  // Eliminar una reseña
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting review:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar la reseña'
      };
    }
  }
};

export default reviewsService;
