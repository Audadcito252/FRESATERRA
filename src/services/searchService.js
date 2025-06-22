import api from './api';

/**
 * Servicio para manejar búsquedas de productos
 */
class SearchService {
  /**
   * Búsqueda general de productos con filtros
   * @param {Object} params - Parámetros de búsqueda
   * @returns {Promise} Lista de productos con paginación
   */
  async searchProducts(params = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      // Parámetros de búsqueda
      if (params.search) searchParams.append('search', params.search);
      if (params.category) searchParams.append('categoria', params.category);
      if (params.minPrice) searchParams.append('precio_min', params.minPrice);
      if (params.maxPrice) searchParams.append('precio_max', params.maxPrice);
      if (params.minRating) searchParams.append('rating_min', params.minRating);
      if (params.onlyAvailable) searchParams.append('solo_disponibles', 'true');
      
      // Parámetros de ordenamiento
      if (params.sortBy) searchParams.append('ordenar', params.sortBy);
      if (params.sortOrder) searchParams.append('direccion', params.sortOrder);
      
      // Paginación
      if (params.page) searchParams.append('page', params.page);
      if (params.perPage) searchParams.append('por_pagina', params.perPage);

      const response = await api.get(`/products?${searchParams.toString()}`);
      
      return {
        success: true,
        products: response.data || [],
        pagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total
        },
        filters: response.filtros_aplicados || {}
      };
    } catch (error) {
      console.error('Error en búsqueda de productos:', error);
      throw {
        success: false,
        message: error.message || 'Error al buscar productos',
        status: error.status
      };
    }
  }

  /**
   * Búsqueda rápida para autocompletado
   * @param {string} query - Término de búsqueda
   * @param {number} limit - Número máximo de resultados
   * @returns {Promise} Lista de productos para autocompletado
   */
  async quickSearch(query, limit = 10) {
    try {
      if (!query || query.trim().length < 1) {
        return {
          success: true,
          products: [],
          total: 0
        };
      }

      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      
      return {
        success: true,
        products: response.data || [],
        total: response.total || 0,
        query: response.query
      };
    } catch (error) {
      console.error('Error en búsqueda rápida:', error);
      
      // Si hay error, devolver resultado vacío para no romper la UI
      return {
        success: false,
        products: [],
        total: 0,
        message: error.message || 'Error al buscar productos'
      };
    }
  }

  /**
   * Obtener sugerencias de búsqueda basadas en productos populares
   * @returns {Promise} Lista de sugerencias
   */
  async getSearchSuggestions() {
    try {
      const response = await api.get('/products/featured?limit=5');
      
      const suggestions = response.data?.map(product => ({
        id: product.id_producto,
        text: product.nombre,
        type: 'product'
      })) || [];

      return {
        success: true,
        suggestions
      };
    } catch (error) {
      console.error('Error obteniendo sugerencias:', error);
      return {
        success: false,
        suggestions: []
      };
    }
  }

  /**
   * Construir URL de búsqueda para navegación
   * @param {Object} params - Parámetros de búsqueda
   * @returns {string} URL completa con parámetros
   */
  buildSearchUrl(params = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });

    return `/products${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  }

  /**
   * Parsear parámetros de búsqueda desde URL
   * @param {string} searchString - Query string de la URL
   * @returns {Object} Objeto con parámetros parseados
   */
  parseSearchParams(searchString) {
    const params = new URLSearchParams(searchString);
    
    return {
      search: params.get('search') || '',
      category: params.get('category') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      minRating: params.get('minRating') || '',
      sortBy: params.get('sortBy') || 'relevancia',
      sortOrder: params.get('sortOrder') || 'desc',
      page: parseInt(params.get('page')) || 1,
      perPage: parseInt(params.get('perPage')) || 12
    };
  }
}

// Exportar instancia singleton
const searchService = new SearchService();
export default searchService;
