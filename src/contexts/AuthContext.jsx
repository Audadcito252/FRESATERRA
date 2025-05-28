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
    const token = localStorage.getItem('token');

    // Si hay token pero no user, intenta obtener el usuario
    if (token && (!storedUser || storedUser === 'undefined')) {
      const fetchUser = async () => {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/me');

          if (response.data && response.data.user) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
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
        setUser(JSON.parse(storedUser));
        // Asegúrate de que el token está configurado en las cabeceras
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

  // const login = async (email, password) => {
  //   setIsLoading(true);
  //   try {
  //     const userData = await mockLogin(email, password);

  //     // Agregamos pedidos de demostración para usuarios normales
  //     userData.orders = [
  //       {
  //         id: 'ORD-1234-5678',
  //         date: '12/04/2025',
  //         total: 49.98,
  //         status: 'Entregado',
  //         items: [
  //           { name: 'Fresas Premium 1kg', price: 12.99, quantity: 2 },
  //           { name: 'Mermelada de Fresa 250g', price: 7.99, quantity: 3 }
  //         ]
  //       },
  //       {
  //         id: 'ORD-8765-4321',
  //         date: '28/03/2025',
  //         total: 34.97,
  //         status: 'Procesando',
  //         items: [
  //           { name: 'Mix de Fresas Orgánicas 500g', price: 9.99, quantity: 1 },
  //           { name: 'Cesta de Regalo Deluxe', price: 24.99, quantity: 1 }
  //         ]
  //       }
  //     ];

  //     setUser(userData);
  //     localStorage.setItem('user', JSON.stringify(userData));
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/login', { email, password });
      console.log('Login response:', response.data); // Para depuración

      // Verificar que la respuesta tenga el formato esperado
      if (response.data && response.data.token) {
        // Si solo tenemos token pero no user en la respuesta
        if (!response.data.user) {
          // Hacer una petición adicional para obtener los datos del usuario
          const userResponse = await api.get('/api/me', {
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            }
          });

          // Estructura esperada: { user: {...} }
          if (userResponse.data && userResponse.data.user) {
            const token = response.data.token;
            const user = userResponse.data.user;

            // Guarda el token
            localStorage.setItem('token', token);

            // Configura el token para futuras peticiones
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Guardar usuario en localStorage como string JSON
            localStorage.setItem('user', JSON.stringify(user));

            // Actualizar el estado
            setUser(user);

            return user;
          }
        } else {
          // Tenemos tanto token como user en la respuesta
          const { token, user } = response.data;

          // Verificar que el usuario no es undefined antes de guardarlo
          if (user) {
            // Guarda el token
            localStorage.setItem('token', token);

            // Configura el token para futuras peticiones
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Guardar usuario en localStorage como string JSON
            localStorage.setItem('user', JSON.stringify(user));

            // Actualizar el estado
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

  // const register = async (email, password, firstName, lastName) => {
  //   setIsLoading(true);
  //   try {
  //     // This would be an API call in a real app
  //     const userData = {
  //       id: Math.random().toString(36).substr(2, 9),
  //       email,
  //       firstName,
  //       lastName
  //     };
  //     setUser(userData);
  //     localStorage.setItem('user', JSON.stringify(userData));
  //   } catch (error) {
  //     console.error('Registration failed:', error);
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const register = async (email, password, firstname, lastName) => {
    setIsLoading(true);
    try {
      // Crear el nombre completo a partir de firstName y lastName
      const name = `${firstname} ${lastName}`;

      // Llamada a la API para registrar el usuario
      const response = await api.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: password // Tu backend requiere confirmación de contraseña
      });

      console.log('Register response:', response.data);

      // Si el registro es exitoso y el backend devuelve un token
      if (response.data && response.data.user) {
        const user = response.data.user;

        // Si el registro también incluye un token de autenticación
        if (response.data.token) {
          const token = response.data.token;

          // Guarda el token
          localStorage.setItem('token', token);

          // Configura el token para futuras peticiones
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Guardar usuario en localStorage como string JSON
        localStorage.setItem('user', JSON.stringify(user));

        // Actualizar el estado
        setUser(user);

        return user;
      } else {
        // Si solo devuelve usuario sin token, necesitarás hacer login después
        return response.data;
      }
    } catch (error) {
      console.error('Registration failed:', error);

      // Manejar errores de validación
      if (error.response?.status === 422) {
        throw new Error(
          Object.values(error.response.data.error)
            .flat()
            .join('\n')
        );
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem('user');
  // };

  // const logout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   delete api.defaults.headers.common['Authorization'];
  //   setUser(null);
  // };

  const logout = async () => {
    try {
      // Solo intentar hacer logout en el servidor si hay un token
      const token = localStorage.getItem('token');
      if (token) {
        // Asegurarse de que el token esté en los headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Llamar al endpoint de logout del servidor
        await api.post('/api/logout');
        console.log('Logout exitoso en el servidor');
      }
    } catch (error) {
      console.error('Error durante el logout en el servidor:', error);
      // Continuar con el logout del lado del cliente incluso si falla en el servidor
    } finally {
      // Siempre ejecutar estas acciones de limpieza independientemente de si la llamada a la API tuvo éxito
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  // const resetPassword = async (email) => {
  //   // This would be an API call in a real app
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log(`Password reset email sent to ${email}`);
  //       resolve();
  //     }, 1000);
  //   });
  // };

  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      // Llamada a la API para solicitar el restablecimiento de contraseña
      const response = await api.post('/api/password/email', { email });

      console.log('Reset password response:', response.data);

      // Verificar si la solicitud fue exitosa
      if (response.data && response.data.message) {
        return response.data.message;
      }

      return 'Se ha enviado un enlace de restablecimiento a tu correo electrónico';
    } catch (error) {
      console.error('Password reset request failed:', error);

      // Manejo específico de errores de validación
      if (error.response?.status === 422) {
        throw new Error(
          Object.values(error.response.data.error || error.response.data.errors || {})
            .flat()
            .join('\n')
        );
      }

      throw new Error('No se pudo procesar la solicitud de restablecimiento de contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // const updateProfile = async (userData) => {
  //   setIsLoading(true);
  //   try {
  //     // This would be an API call in a real app
  //     const updatedUser = { ...user, ...userData };
  //     setUser(updatedUser);
  //     localStorage.setItem('user', JSON.stringify(updatedUser));
  //   } catch (error) {
  //     console.error('Profile update failed:', error);
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Debes iniciar sesión para actualizar tu perfil' };
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.patch('/api/profile', userData);
      console.log('Update profile response:', response.data);
      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return {
          success: true,
          message: response.data.message || 'Perfil actualizado exitosamente',
          user: updatedUser
        };
      }
      return { success: false, error: 'La respuesta del servidor no incluyó los datos actualizados' };
    } catch (error) {
      console.error('Profile update failed:', error);
      if (error.response?.status === 422) {
        return {
          success: false,
          error: Object.values(error.response.data.error || error.response.data.errors || {}).flat().join('\n')
        };
      }
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        return { success: false, error: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión' };
      }
      return { success: false, error: 'Error al actualizar el perfil' };
    } finally {
      setIsLoading(false);
    }
  };

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
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};