// filepath: c:\Users\MikeZeroX\Desktop\fresafront\FRESATERRA\src\services\api.js

import axios from 'axios';
import config from '../config/config'; // Importar configuración centralizada

// Usar configuración centralizada
const baseURL = config.apiUrl;

// Crear instancia de Axios
const api = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Agregar token automáticamente
api.interceptors.request.use(
  (requestConfig) => {
    // Token de usuario regular
    const token = localStorage.getItem('token');
    
    // Token de administrador
    const adminToken = localStorage.getItem('adminToken');
    const isAdminRoute = requestConfig.url && (requestConfig.url.includes('/admin/') || requestConfig.url.startsWith('admin/'));
      // Usar token de admin para rutas administrativas, token regular para otras rutas
    if (isAdminRoute && adminToken) {
      requestConfig.headers.Authorization = `Bearer ${adminToken}`;
      config.log('Using admin token for admin route:', requestConfig.url);
      config.log('Admin token preview:', adminToken.substring(0, 50) + '...');
    } else if (token && !isAdminRoute) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
      config.log('Using regular token for route:', requestConfig.url);
    } else if (isAdminRoute && !adminToken) {
      console.error('No admin token found for admin route:', requestConfig.url);
    }
    
    // Log para debugging usando config centralizado
    config.log('API Request:', {
      method: requestConfig.method?.toUpperCase(),
      url: requestConfig.url,
      data: requestConfig.data,
      headers: requestConfig.headers,
      isAdminRoute: isAdminRoute
    });
    
    return requestConfig;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Manejo global de errores
api.interceptors.response.use(
  (response) => {
    // Solo log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    
    return response.data; // Retornar solo los datos
  },
  (error) => {
    // No logueamos 404 para my-review como error ya que es comportamiento esperado
    const isUserReviewNotFound = error.config?.url?.includes('/my-review') && error.response?.status === 404;
    
    if (!isUserReviewNotFound) {
      console.error('API Error:', error);
    }

    // Manejo específico de errores
    if (error.response) {
      // El servidor respondió con un error
      const { status, data } = error.response;
      // Token expirado o no válido
      if (status === 401) {
        // No redirigir automáticamente si es un intento de login
        const isLoginAttempt = error.config?.url?.includes('/login');
        const isAdminRoute = error.config?.url && (error.config.url.includes('/admin/') || error.config.url.startsWith('admin/'));
        
        if (!isLoginAttempt) {
          if (isAdminRoute) {
            // Limpiar datos de admin y redirigir al login de admin
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('isAdminAuthenticated');
            window.location.href = '/admin/login';
          } else {
            // Limpiar datos de usuario regular y redirigir al login regular
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      }
      
      // Crear error personalizado con información útil
      let errorMessage = data?.message || data?.error || `HTTP ${status}: ${error.response.statusText}`;
      
      // Manejo especial para errores de validación (422)
      if (status === 422 && data?.errors) {
        // Convertir errores de validación en un mensaje legible
        const validationErrors = Object.values(data.errors)
          .flat()
          .join('\n• ');
        errorMessage = `Error de validación:\n• ${validationErrors}`;
      }
      
      const customError = new Error(errorMessage);
      customError.status = status;
      customError.data = data;
      customError.validationErrors = data?.errors; // Para acceso directo a errores específicos
      
      // Para errores de validación (422)
      if (status === 422 && data?.errors) {
        customError.validationErrors = data.errors;
        customError.message = Object.values(data.errors)
          .flat()
          .join('\n');
      }
      
      return Promise.reject(customError);
    } else if (error.request) {
      // No hubo respuesta del servidor
      const networkError = new Error('Error de conexión. Verifica tu internet.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    } else {
      // Error en la configuración de la request
      return Promise.reject(new Error('Error interno de la aplicación'));
    }
  }
);

export default api;
