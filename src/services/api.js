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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (remover en producción)
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
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
        
        if (!isLoginAttempt) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Solo redirigir si NO es un intento de login
          window.location.href = '/login';
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
