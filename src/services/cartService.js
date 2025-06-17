import api from './api';

const cartService = {  // Obtener carrito del usuario
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      console.log('Cart service response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      // Si es un error 404, significa que el usuario no tiene carrito aún
      if (error.response && error.response.status === 404) {
        return { data: { items: [], total: 0 } };
      }
      throw error;
    }
  },
  // Agregar producto al carrito
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart', {
        producto_id: productId,
        cantidad: quantity,
      });
      console.log('Add to cart response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      throw error;
    }
  },

  // Actualizar cantidad de un item
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, {
        cantidad: quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando carrito:', error);
      throw error;
    }
  },

  // Eliminar item del carrito
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      throw error;
    }
  },

  // Vaciar el carrito completamente
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Error vaciando el carrito:', error);
      throw error;
    }
  },

  // Hacer checkout del carrito
  checkout: async (checkoutData) => {
    try {
      const response = await api.post('/cart/checkout', checkoutData);
      return response.data;
    } catch (error) {
      console.error('Error en checkout:', error);
      throw error;
    }
  },
};

export default cartService;
