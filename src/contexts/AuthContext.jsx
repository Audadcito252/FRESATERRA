import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await mockLogin(email, password);
      
      // Agregamos pedidos de demostración para usuarios normales
      userData.orders = [
        {
          id: 'ORD-1234-5678',
          date: '12/04/2025',
          total: 49.98,
          status: 'Entregado',
          items: [
            { name: 'Fresas Premium 1kg', price: 12.99, quantity: 2 },
            { name: 'Mermelada de Fresa 250g', price: 7.99, quantity: 3 }
          ]
        },
        {
          id: 'ORD-8765-4321',
          date: '28/03/2025',
          total: 34.97,
          status: 'Procesando',
          items: [
            { name: 'Mix de Fresas Orgánicas 500g', price: 9.99, quantity: 1 },
            { name: 'Cesta de Regalo Deluxe', price: 24.99, quantity: 1 }
          ]
        }
      ];
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
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

  const register = async (email, password, firstName, lastName) => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        firstName,
        lastName
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const resetPassword = async (email) => {
    // This would be an API call in a real app
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Password reset email sent to ${email}`);
        resolve();
      }, 1000);
    });
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
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