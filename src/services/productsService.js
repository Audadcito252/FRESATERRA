import api from './api';

// Servicio para productos
export const productsService = {
  // Obtener todos los productos con filtros opcionales
  getProducts: async (filters = {}) => {
    const params = {};
    
    // Filtros básicos
    if (filters.categoria) params.categoria = filters.categoria;
    if (filters.busqueda) params.busqueda = filters.busqueda;
    
    // Filtros de precio
    if (filters.precio_min) params.precio_min = filters.precio_min;
    if (filters.precio_max) params.precio_max = filters.precio_max;
    
    // Filtros de rating
    if (filters.rating_min) params.rating_min = filters.rating_min;
    
    // Filtros de disponibilidad
    if (filters.solo_disponibles) params.solo_disponibles = filters.solo_disponibles;
    
    // Ordenamiento
    if (filters.ordenar) params.ordenar = filters.ordenar;
    if (filters.direccion) params.direccion = filters.direccion;
    
    // Paginación
    if (filters.por_pagina) params.por_pagina = filters.por_pagina;
    if (filters.page) params.page = filters.page;
    
    return await api.get('/products', { params });
  },

  // Obtener productos destacados
  getFeaturedProducts: async () => {
    return await api.get('/products/featured');
  },

  // Obtener un producto específico
  getProduct: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Obtener todas las categorías
  getCategories: async () => {
    return await api.get('/categories');
  },

  // Obtener estadísticas de productos
  getProductStats: async () => {
    return await api.get('/products/stats');
  },
};

// Servicio para el carrito
export const cartService = {
  // Obtener carrito del usuario
  getCart: async () => {
    return await api.get('/cart');
  },

  // Agregar producto al carrito
  addToCart: async (productId, quantity) => {
    return await api.post('/cart', {
      producto_id: productId,
      cantidad: quantity,
    });
  },

  // Actualizar cantidad de un item en el carrito
  updateCartItem: async (itemId, quantity) => {
    return await api.put(`/cart/${itemId}`, {
      cantidad: quantity,
    });
  },

  // Eliminar item del carrito
  removeFromCart: async (itemId) => {
    return await api.delete(`/cart/${itemId}`);
  },

  // Hacer checkout del carrito
  checkout: async (checkoutData) => {
    return await api.post('/cart/checkout', checkoutData);
  },
};

export default productsService;
