import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import api from '../services/api'; // Importar el servicio centralizado que manejara todas las peticiones a la API

// Eliminar todos los tipos y anotaciones de TypeScript
const AuthContext = createContext(null);

// Mock functions para demostración
const mockLogin = async (email, password) => {
  // This would be an API call in a real app
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Strawberry Lane',
        phone: '555-123-4567'
      });
    }, 1000);
  });
};

// Añade un nuevo usuario o actualiza el existente
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');    // Si hay token pero no user, intenta obtener el usuario
    if (token && (!storedUser || storedUser === 'undefined')) {
      const fetchUser = async () => {
        try {
          // api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Handled by api.js
          const response = await api.get('/me'); // Changed from /api/me

          if (response && response.user) { // Adjusted to expect response.user directly based on fetch wrapper
            const user = response.user;
            
            // Verificar si la cuenta está desactivada
            if (user.status === 'inactive' || user.active === false || user.deactivated === true) {
              console.log('Usuario con cuenta desactivada detectado, cerrando sesión');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            } else {
              setUser(user);
              localStorage.setItem('user', JSON.stringify(user));
            }
          } else {
            // Si no se puede obtener el usuario, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } finally {
          setIsLoading(false);
        }
      };

      // Llamar a la función para obtener el usuario
      fetchUser();

      // Si hay un usuario intenta parsearlo
    } else if (storedUser && storedUser !== 'undefined') {
      try {
        const user = JSON.parse(storedUser);
        
        // Verificar si la cuenta está desactivada
        if (user.status === 'inactive' || user.active === false || user.deactivated === true) {
          console.log('Usuario con cuenta desactivada detectado en localStorage, cerrando sesión');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(user);
          // Asegúrate de que el token está configurado en las cabeceras
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoading(false);
      }
    } else {
      // Si no hay usuario almacenado, asegúrate de limpiar localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsLoading(false);
    }
  }, []);
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });

      // TODO: Eliminar este log en producción
      console.log('Login response:', response);

      if (response && response.token) {
        if (!response.user) {
          // Obtener datos del usuario
          const userResponse = await api.get('/me');

          if (userResponse && userResponse.user) {
            const token = response.token;
            const user = userResponse.user;

            // Verificar si la cuenta está desactivada
            if (user.status === 'inactive' || user.active === false || user.deactivated === true) {
              throw new Error('Tu cuenta ha sido desactivada. Por favor, contacta al soporte para reactivarla.');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
          }
        } else {
          const { token, user } = response;

          if (user) {
            // Verificar si la cuenta está desactivada
            if (user.status === 'inactive' || user.active === false || user.deactivated === true) {
              throw new Error('Tu cuenta ha sido desactivada. Por favor, contacta al soporte para reactivarla.');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
          }
        }
      }

      throw new Error('Formato de respuesta inesperado del servidor');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would integrate with Google OAuth
      const userData = {
        id: '2',
        email: 'user@example.com',
        firstName: 'Google',
        lastName: 'User',
        address: '456 Tech Avenue',
        city: 'Silicon Valley',
        state: 'California',
        zipCode: '94000',
        phone: '555-987-6543',
        // Agregamos pedidos simulados para usuarios de Google
        orders: [
          {
            id: 'ORD-GOOG-1234',
            date: '15/05/2025',
            total: 65.97,
            status: 'Entregado',
            items: [
              { name: 'Fresas Premium 1kg', price: 12.99, quantity: 3 },
              { name: 'Jugo de Fresa Orgánico', price: 8.99, quantity: 3 }
            ]
          },
          {
            id: 'ORD-GOOG-5678',
            date: '10/05/2025',
            total: 42.98,
            status: 'En camino',
            items: [
              { name: 'Fresa Deshidratada 200g', price: 7.99, quantity: 2 },
              { name: 'Cesta de Regalo Deluxe', price: 24.99, quantity: 1 }
            ]
          }
        ]
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // * Ejemplo de datos de registro esperados por la API
  // "nombre": "Juan Carlos",
  // "apellidos": "García López",
  // "email": "juan.garcia@email.com",
  // "telefono": "987654321",
  // "password": "miPassword123",
  // "password_confirmation": "miPassword123"

  const register = async (email, password, firstname, lastName, telefono) => {
    setIsLoading(true);
    try {
      const requestData = {
        nombre: firstname,
        apellidos: lastName,
        email,
        password,
        password_confirmation: password,
        telefono
      };

      console.log('Sending registration data:', requestData);

      // Con Axios, ya no necesitas verificar response.ok
      // El interceptor maneja los errores automáticamente
      const response = await api.post('/register', requestData);

      console.log('Register response:', response);

      // Axios ya parsea JSON automáticamente
      if (response && response.user) {
        const user = response.user;

        if (response.token) {
          const token = response.token;
          localStorage.setItem('token', token);
        }

        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Registration failed:', error);

      // Manejo mejorado de errores
      if (error.status === 422 && error.validationErrors) {
        // Devolver un mensaje más detallado para la UI
        const errorMessage = error.message || 'Error en el formulario de registro';
        const enhancedError = new Error(errorMessage);
        enhancedError.validationErrors = error.validationErrors;
        throw enhancedError;
      }

      // Para otro tipo de errores
      throw new Error(error.message || 'Error al crear la cuenta. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/logout');
        console.log('Logout exitoso en el servidor');
      }
    } catch (error) {
      console.error('Error durante el logout en el servidor:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      // Llamada a la API para solicitar el restablecimiento de contraseña
      const response = await api.post('/password/email', { email }); // Changed from /api/password/email

      console.log('Reset password response:', response);

      // Verificar si la solicitud fue exitosa
      if (response && response.message) {
        return response.message;
      }

      return 'Se ha enviado un enlace de restablecimiento a tu correo electrónico';
    } catch (error) {
      console.error('Password reset request failed:', error);

      // Manejo específico de errores de validación
      if (error.status === 422) { // Changed from error.response?.status
        throw new Error(
          Object.values(error.data.error || error.data.errors || {}) // Changed from error.response.data.error and added fallback for errors key
            .flat()
            .join('\\n')
        );
      }

      throw new Error('No se pudo procesar la solicitud de restablecimiento de contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Debes iniciar sesión para actualizar tu perfil' };
      }

      // Filtrar solo los campos que se van a actualizar (no enviar vacíos)
      const updateData = {};
      if (userData.nombre && userData.nombre.trim()) updateData.nombre = userData.nombre.trim();
      if (userData.apellidos && userData.apellidos.trim()) updateData.apellidos = userData.apellidos.trim();
      if (userData.email && userData.email.trim()) updateData.email = userData.email.trim();
      if (userData.telefono && userData.telefono.trim()) updateData.telefono = userData.telefono.trim();

      // Verificar que hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        return { success: false, error: 'No se proporcionaron datos para actualizar' };
      }

      console.log('Sending profile update data:', updateData);

      const response = await api.patch('/profile', updateData);

      console.log('Update profile response:', response);

      if (response && response.user) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return {
          success: true,
          message: response.message || 'Perfil actualizado exitosamente',
          user: updatedUser
        };
      }

      return { success: false, error: 'La respuesta del servidor no incluyó los datos actualizados' };
    } catch (error) {
      console.error('Profile update failed:', error);

      if (error.status === 422) {
        // Formatear errores de validación
        let errorMessage = 'Errores de validación:\n';
        if (error.data && error.data.error) {
          if (typeof error.data.error === 'object') {
            errorMessage = Object.entries(error.data.error)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('\n');
          } else {
            errorMessage = error.data.error;
          }
        }
        return {
          success: false,
          error: errorMessage
        };
      }

      if (error.status === 401) {
        // El interceptor ya limpió localStorage
        setUser(null);
        return { success: false, error: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión' };
      }

      if (error.status === 400) {
        return { success: false, error: error.message || 'No se proporcionaron datos para actualizar' };
      }

      return { success: false, error: 'Error al actualizar el perfil' };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cambiar la contraseña para usuarios autenticados
  const changePassword = async (currentPassword, newPassword, passwordConfirmation) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Debes iniciar sesión para cambiar tu contraseña' };
      }

      const requestData = {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation
      };

      console.log('Sending password change request');

      const response = await api.patch('/me/password', requestData);

      console.log('Change password response:', response);

      return {
        success: true,
        message: response.message || 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      console.error('Password change failed:', error);

      if (error.status === 422) {
        // Formatear errores de validación
        let errorMessage = 'Errores de validación:\n';
        if (error.data && error.data.error) {
          if (typeof error.data.error === 'object') {
            errorMessage = Object.entries(error.data.error)
              .map(([field, messages]) => {
                const fieldNames = {
                  'current_password': 'Contraseña actual',
                  'password': 'Nueva contraseña',
                  'password_confirmation': 'Confirmación de contraseña'
                };
                return `${fieldNames[field] || field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
              })
              .join('\n');
          } else {
            errorMessage = error.data.error;
          }
        }
        return {
          success: false,
          error: errorMessage
        };
      }

      if (error.status === 401) {
        // El interceptor ya limpió localStorage
        setUser(null);
        return { success: false, error: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión' };
      }

      return { success: false, error: 'Error al cambiar la contraseña' };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para desactivar cuenta
  const deactivateAccount = async (currentPassword) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Debes iniciar sesión para desactivar tu cuenta' };
      }

      const requestData = {
        password: currentPassword,
        confirmation: 'DESACTIVAR'
      };      console.log('Sending account deactivation request');

      const response = await api.patch('/me/deactivate', requestData);

      console.log('Deactivate account response:', response);

      // Limpiar datos de sesión después de desactivar exitosamente
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);

      return {
        success: true,
        message: response.message || 'Cuenta desactivada exitosamente'
      };
    } catch (error) {
      console.error('Account deactivation failed:', error);

      if (error.status === 422) {
        // Formatear errores de validación
        let errorMessage = 'Errores de validación:\n';
        if (error.data && error.data.error) {
          if (typeof error.data.error === 'object') {
            errorMessage = Object.entries(error.data.error)
              .map(([field, messages]) => {
                const fieldNames = {
                  'password': 'Contraseña',
                  'confirmation': 'Confirmación'
                };
                return `${fieldNames[field] || field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
              })
              .join('\n');
          } else {
            errorMessage = error.data.error;
          }
        }
        return {
          success: false,
          error: errorMessage
        };
      }      if (error.status === 401) {
        // Contraseña incorrecta o token inválido
        return { success: false, error: 'Contraseña incorrecta o sesión expirada' };
      }

      if (error.status === 403) {
        // Cuenta ya desactivada o sin permisos
        return { success: false, error: 'Tu cuenta ya está desactivada o no tienes permisos para realizar esta acción' };
      }

      if (error.status === 400) {
        return { success: false, error: error.message || 'Datos inválidos para desactivar la cuenta' };
      }

      return { success: false, error: 'Error al desactivar la cuenta' };
    } finally {
      setIsLoading(false);
    }
  };

  // Proporcionar el contexto de autenticación
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
        updateProfile,
        changePassword,
        deactivateAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('use Auth must be used within an AuthProvider');
  }
  return context;
};