// filepath: c:\Users\MikeZeroX\Desktop\fresafront\FRESATERRA\src\services\api.js

import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/v1';

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
  (config) => {
    // Token de usuario regular
    const token = localStorage.getItem('token');
    
    // Token de administrador
    const adminToken = localStorage.getItem('adminToken');
    const isAdminRoute = config.url && (config.url.includes('/admin/') || config.url.startsWith('admin/'));
    
    // Usar token de admin para rutas administrativas, token regular para otras rutas
    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log('Using admin token for admin route:', config.url);
    } else if (token && !isAdminRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (remover en producción)
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers,
      isAdminRoute: isAdminRoute
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Manejo global de errores
api.interceptors.response.use(
  (response) => {
    // Log para debugging (remover en producción)
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    
    return response.data; // Retornar solo los datos
  },
  (error) => {
    console.error('API Error:', error);

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
