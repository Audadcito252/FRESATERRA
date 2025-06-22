// filepath: /src/services/authService.js
import api from './api';

class AuthService {
  /**
   * Login tradicional con email y contraseña
   */
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      
      if (response.success && response.token) {
        // Guardar token y datos de usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return {
          success: true,
          user: response.user,
          token: response.token
        };
      }
      
      throw new Error(response.message || 'Error en el login');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Registro de nuevo usuario
   */
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      
      if (response.token) {
        // Guardar token y datos de usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      // Intentar cerrar sesión en el servidor
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado del servidor
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Obtener datos del usuario actual
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/me');
      return response.user;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      throw error;
    }
  }

  /**
   * Iniciar flujo de autenticación social (redirigir a provider)
   */
  initiateSocialAuth(provider) {
    if (!['google', 'facebook'].includes(provider)) {
      throw new Error('Proveedor de autenticación no válido');
    }

    const authUrl = `${api.defaults.baseURL}/auth/${provider}/redirect`;
    window.location.href = authUrl;
  }

  /**
   * Manejar el callback de autenticación social
   * Este método será llamado cuando el usuario regrese del proveedor
   */
  async handleSocialCallback(token) {
    try {
      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }

      // Validar el token con el backend
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.success && response.user) {
        // Guardar token y datos de usuario
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return {
          success: true,
          user: response.user,
          token: token
        };
      }

      throw new Error('Error validando token social');
    } catch (error) {
      console.error('Error en callback social:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Obtener token actual
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Obtener usuario actual del localStorage
   */
  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(profileData) {
    try {
      const response = await api.patch('/profile', profileData);
      
      if (response.success && response.user) {
        // Actualizar datos de usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await api.patch('/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      
      return response;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/password/email', { email });
      return response;
    } catch (error) {
      console.error('Error solicitando recuperación de contraseña:', error);
      throw error;
    }
  }
}

// Exportar una instancia singleton
export default new AuthService();
